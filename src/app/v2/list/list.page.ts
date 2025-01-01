import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { DatabaseService } from '../../services/database.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { ToastController } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: false,
  // imports: [UserCardComponent]
})
export class ListPage implements OnInit {
  userRecords: User[] = [];

  constructor(
    private databaseService: DatabaseService,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  async showToast(message: string, type: string) {
    const color =
      type === 'success' ? 'green' : type === 'info' ? 'yellow' : 'red';
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      cssClass: `custom-toast-${type}`,
    });
    toast.present();
  }

  /**
   * Resolves a local path to a web-compatible URI.
   * @param localPath The local path to resolve.
   * @returns A promise that resolves with the web URI.
   */
  private async resolveWebPath(localPath: string): Promise<string> {
    try {
      const fileName = localPath.split('DATA/')[1]; // Extract path after DATA/
      const webPath = await Filesystem.getUri({
        path: `${fileName}`,
        directory: Directory.Data,
      });

      console.log(webPath);

      const path = webPath.uri.replace('file://', '');

      // console.log(webPath.uri);
      // console.log(webPath);
      // console.log(webPath.uri);

      try {
        const fileData = await Filesystem.readFile({
          path: path,
          directory: Directory.Data, // Make sure you specify the correct directory
        });
  
        console.log('f');
  
        console.log(fileData);
      } catch (error) {
        console.error('f ', error)
      }

      return webPath.uri;

      // const base64Image = await this.getBase64ImageFromFile(fileData.data);

      // return base64Image; // Return the web-compatible URI
    } catch (error) {
      console.error('Error resolving web path:', error);
      return ''; // Return an empty string if there's an error
    }
  }

  async getBase64ImageFromFile(uri: string): Promise<string> {
    // Strip the 'file://' part from the uri, as we only need the relative path.
    const path = uri.replace('file://', '');

    try {
      const fileData = await Filesystem.readFile({
        path,
        directory: Directory.Data, // Make sure you specify the correct directory
      });

      return `data:image/png;base64,${fileData.data}`; // You may need to adjust the MIME type based on your file format (jpg, png, etc.)
    } catch (error) {
      console.error('Error reading file: ', error);
      return '';
    }
  }

  async getUsers() {
    // Initialize the records array with the expected User type
    let records: User[] = [];

    try {
      // Fetch users from the database service
      const response = await this.databaseService.getUsers();
      console.log('db');
      console.log(response, ' ', typeof response);

      records = await Promise.all(
        response.map(async (record: Record<string, any>) => {
          const parsedLocation =
            typeof record['location'] === 'string'
              ? JSON.parse(record['location'])
              : record['location'];

          // Resolve the profilePic path to a web-compatible URI
          const profilePicUri =
            record['profilePic'] && typeof record['profilePic'] === 'string'
              ? await this.resolveWebPath(record['profilePic'])
              : null;

          return {
            ...record,
            location: parsedLocation,
            profilePic: profilePicUri, // Replace profilePic with web-compatible URI
          } as User;
        }),
      );

      this.userRecords = records;
      console.log('Processed user records:', this.userRecords);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
}
