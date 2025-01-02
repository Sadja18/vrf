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

  async convertImagePathToPreview(filePath: string) : Promise<string | void> {
    try {
      // split the file path to get file name
      const searchFilePath = `Pictures/${filePath.split('/').pop()}`;

      console.log('file Path ', filePath, ' ', searchFilePath);

      // Read the file from the file system to get the base64 string
      const file = await Filesystem.readFile({
        path: searchFilePath,
        directory: Directory.External,
      });

      // Convert file data to a base64 string for preview
      return 'data:image/jpeg;base64,' + file.data;


    } catch (error) {
      console.error('Error reading the image file:', error);
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
              ? await this.convertImagePathToPreview(record['profilePic'])
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
