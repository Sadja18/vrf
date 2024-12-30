import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';
import { User } from '../models/user.interface';
import { DatabaseService } from '../services/database.service';
@Component({
  selector: 'app-screen3',
  templateUrl: './screen3.page.html',
  styleUrls: ['./screen3.page.scss'],
  standalone: false
})
export class Screen3Page implements OnInit {
  // Static data to display in the list view
  userRecords: User[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      mobile: '+91 9876543210',
      profilePic: 'data:image/png;base64,invalid_base64_data_here',
      gender: 'Male',
      education: 'Masters',
      location: { lat: 28.6139, lng: 77.2090 },  // New Delhi coordinates
      dateOfBirth: '2010-03-03',
      address: 'Gopinagar',
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      mobile: '+91 9123456789',
      profilePic: 'data:image/png;base64,invalid_base64_data_here',
      gender: 'Female',
      education: 'Doctorate',
      location: { lat: 28.6139, lng: 77.2090 },  // New Delhi coordinates
      dateOfBirth: '2010-03-03',
      address: 'Gopinagar',


    },
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      mobile: '+91 9234567890',
      profilePic: 'data:image/png;base64,invalid_base64_data_here',
      gender: 'Female',
      education: 'Bachelor’s',
      location: { lat: 28.6139, lng: 77.2090 },  // New Delhi coordinates
      dateOfBirth: '2010-03-03',
      address: 'Gopinagar',

    },
  ];

  constructor(private modalController: ModalController, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.getUsers();
  }

  // Method to get the default avatar URL based on gender
  getDefaultAvatar(gender: string): string {
    switch (gender) {
      case 'male':
        return 'assets/dp/ma.jpeg';
      case 'female':
        return 'assets/dp/female.jpeg';
      default:
        return 'assets/dp/ma.jpeg';
    }
  }

  // Method to get a valid profile picture or fallback based on gender
  getValidProfilePic(profilePic: string|undefined, gender: string|undefined): string {
    const defaultAvatar = this.getDefaultAvatar(gender??'male');

    // Check if the profile picture is a valid image URL (simplified check here)
    const isValid = profilePic && profilePic.startsWith('data:image/') && profilePic.includes('base64');
    
    // Return the profilePic if valid, otherwise return the fallback image
    return isValid ? profilePic : defaultAvatar;
  }

  async getUsers() {
    // Initialize the records array with the expected User type
    let records: User[] = [];

    try {
      // Fetch users from the database service
      const response = await this.databaseService.getUsers();
      console.log('db');
      console.log(response);

      // Ensure the response is in the correct format (assuming it's an array of records)
      records = response.map((record: Record<string, any>) => {
        // Parse the location if it's a string
        const parsedLocation = typeof record['location'] === 'string' ? JSON.parse(record['location']) : record['location'];

        return {
          ...record, // Spread the rest of the record
          location: parsedLocation // Update location to be an object
        } as User; // Cast to the User type
      });

      console.log("Updated records: ", records);
      // Assign the updated records to userRecords
      this.userRecords = records;

    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }


  // Open modal to show full user data
  async openUserDetails(user: any) {
    const modal = await this.modalController.create({
      component: UserDetailsModalComponent,
      componentProps: { user },
    });
    return await modal.present();
  }

}
