import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import { ZoomModalComponent } from '../zoom-modal/zoom-modal.component';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
  standalone: false,
})
export class PreviewPage implements OnInit {
  userData: User = {
    firstName: 'Johnn',
    lastName: 'Doe',
    address: '123 Main Street',
    mobile: '+911234567890',
    gender: 'Male',
    education: 'Masters',
    dateOfBirth: '1990-01-01',
    location: { lat: 12.9716, lng: 77.5946 },
    profilePic: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
  };
  fields: { label: string; key: keyof User }[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private databaseService: DatabaseService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.userData = this.userService.getUserData();
    this.fields = [
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Address', key: 'address' },
      { label: 'Mobile', key: 'mobile' },
      { label: 'Gender', key: 'gender' },
      { label: 'Education', key: 'education' },
      { label: 'Date of Birth', key: 'dateOfBirth' },
      { label: 'Location', key: 'location' },
      { label: 'Profile Picture', key: 'profilePic' },
    ];
  }

  onEdit(): void {
    // Navigate back to the user form to allow the user to edit
    this.router.navigate(['/input']);
  }

  onSave(): void {
    // Perform the save operation to save to SQLite database
    this.saveUserData();
  }

  saveUserData(): void {
    console.log('Saving user data:', this.userData);
    // Call adduser service
    this.showToast('Data saved successfully', 'success');
  }

  // Open Profile Picture Modal
  async openProfileZoom() {
    const modal = await this.modalController.create({
      component: ZoomModalComponent,
      componentProps: { profilePic: this.userData.profilePic },
    });
    return await modal.present();
  }

  // Open Map Modal
  async openMap() {
    const modal = await this.modalController.create({
      component: MapModalComponent,
      componentProps: { location: this.userData.location },
    });
    return await modal.present();
  }

  async showToast(message: string, type: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      cssClass: `custom-toast-${type}`,
    });
    toast.present();
  }

  onDelete(): void {
    this.databaseService
      .clearUsersTable()
      .then((response) => {
        console.log('response ', response);
      })
      .catch((error) => {
        console.error('error ', error);
      });
  }
}
