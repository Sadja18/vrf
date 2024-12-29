import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditFieldModalComponent } from '../edit-field-modal/edit-field-modal.component';
import { User } from '../models/user.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component'; // Import the modal component
import { CapacitorSQLite,SQLiteConnection,SQLiteDBConnection } from '@capacitor-community/sqlite'; // Import SQLite


@Component({
  selector: 'app-editable-preview',
  templateUrl: './editable-preview.page.html',
  styleUrls: ['./editable-preview.page.scss'],
  standalone: false
})
export class EditablePreviewPage implements OnInit {
  userData: User = {
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    mobile: '+911234567890',
    gender: 'Male',
    education: 'Masters',
    dateOfBirth: '1990-01-01',
    location: { lat: 12.9716, lng: 77.5946 },
    profilePic: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
  };
  fields :{label:string,key: keyof User}[] = [];  
  sqlite: SQLiteConnection;
  
 

  constructor(
    private modalController: ModalController
  ) {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }
  
  

  ngOnInit() {
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

  async editField(fieldKey: keyof User) {
    const modal = await this.modalController.create({
      component: EditFieldModalComponent,
      componentProps: {
        fieldName: this.fields.find((f) => f.key === fieldKey)?.label,
        existingValue: this.userData[fieldKey],
        fieldType: this.getFieldType(fieldKey),
      },
    });

    modal.onWillDismiss().then((result) => {
      if (result.data) {
        this.userData[fieldKey] = result.data;
      }
    });

    return await modal.present();
  }

  getFieldType(fieldKey: keyof typeof this.userData): string {
    switch (fieldKey) {
      case 'firstName':
        return 'text';
      case 'lastName':
        return 'text';
      case 'address':
        return 'textarea';
      case 'mobile':
        return 'number';
      case 'gender':
        return 'radio';
      case 'education':
        return 'dropdown';
      case 'dateOfBirth':
        return 'datetime';
      case 'profilePic':
        return 'camera';
      default:
        return 'text';
    }
  }
// Open confirmation modal
async openConfirmModal() {
  const modal = await this.modalController.create({
    component: ConfirmModalComponent,
    componentProps: {
      userData: this.userData,
    },
  });

  modal.onWillDismiss().then((result) => {
    if (result.data && result.data.confirmed) {
      this.saveToDatabase();
    }
  });

  await modal.present();
}
async saveToDatabase(){}
}
