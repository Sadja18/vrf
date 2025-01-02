import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import { ZoomModalComponent } from '../zoom-modal/zoom-modal.component';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { DateFormatPipe } from 'src/app/date-format.pipe';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { ImageProcessorService } from 'src/app/services/image-processor.service';

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
    profilePic:
      'data:image/png;base64,   iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  };
  fields: { label: string; key: keyof User }[] = [];

  private debugMode: boolean = false;
  imagePreview: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private databaseService: DatabaseService,
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  async ngOnInit() {
    if (!this.debugMode) {
      this.userData = this.userService.getUserData();
    }

    await this.convertImagePathToPreview(this.userData.profilePic);

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
    this.router.navigate(['/input'], { state: { editForm: true } });
  }

  onSave(): void {
    // Perform the save operation to save to SQLite database
    this.saveUserData();
  }

  async saveUserData(): Promise<void> {
    console.log('Saving user data:', this.userData);
    // Call adduser service

    console.log(this.userData.profilePic);

    try {
      this.databaseService.addUser(
        this.userData.firstName,
        this.userData.lastName,
        this.userData.dateOfBirth,
        this.userData.mobile,
        this.userData.address,
        this.userData.profilePic, //save file path
        this.userData.gender,
        this.userData.education,
        this.userData.location,
      );
      this.showToast('Data saved successfully', 'success');
      this.userService.resetUserData();
      await this.clearCacheFiles();
      this.router.navigate(['/list']);
    } catch (error) {
      this.showToast('Error saving data', 'error');
    }
  }

  async convertImagePathToPreview(filePath: string) {
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
      this.imagePreview = 'data:image/jpeg;base64,' + file.data;
    } catch (error) {
      console.error('Error reading the image file:', error);
    }
  }

  // Open Profile Picture Modal
  async openProfileZoom() {
    const modal = await this.modalController.create({
      component: ZoomModalComponent,
      componentProps: { profilePic: this.imagePreview },
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

  // Method to clear all files from Directory.Cache/
  async clearCacheFiles(): Promise<void> {
    try {
      // Get the list of files in the cache directory
      const files = await Filesystem.readdir({
        directory: Directory.Cache,
        path: '',
      });
      console.log(files);

      // Loop through and delete each file in the cache
      for (const file of files.files) {
        await Filesystem.deleteFile({
          path: file.name,
          directory: Directory.Cache,
        });
        console.log(`Deleted file: ${file}`);
      }
    } catch (error) {
      console.error('Error clearing cache files:', error);
    }
  }
}
