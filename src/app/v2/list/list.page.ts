import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { DatabaseService } from '../../services/database.service';
import { UserCardComponent } from '../user-card/user-card.component';
import { ToastController } from '@ionic/angular';

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

  async getUsers() {
    // Initialize the records array with the expected User type
    let records: User[] = [];

    try {
      // Fetch users from the database service
      const response = await this.databaseService.getUsers();
      console.log('db');
      console.log(response, ' ', typeof response);

      // Ensure the response is in the correct format (assuming it's an array of records)
      records = response.map((record: Record<string, any>) => {
        // Parse the location if it's a string
        const parsedLocation =
          typeof record['location'] === 'string'
            ? JSON.parse(record['location'])
            : record['location'];

        return {
          ...record, // Spread the rest of the record
          location: parsedLocation, // Update location to be an object
        } as User; // Cast to the User type
      });

      console.log('Updated records: ', records);
      // Assign the updated records to userRecords
      this.userRecords = records;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
}
