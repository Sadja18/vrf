import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserDetailsModalComponent } from '../user-details-modal/user-details-modal.component';
import { User } from '../models/user.interface';

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

  constructor(private modalController: ModalController) { }

  ngOnInit() {
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
