import { Component, Input, OnInit } from '@angular/core';
import { User } from '../models/user.interface';
import { ModalController } from '@ionic/angular';
import { 
  IonGrid, IonFooter, IonRow,  
  IonCol, IonLabel, IonContent, 
  IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonButton, IonItem, 
  IonAvatar 
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-details-modal',
  templateUrl: './user-details-modal.component.html',
  styleUrls: ['./user-details-modal.component.scss'],
  imports: [
    IonHeader, CommonModule,
    IonContent, IonTitle,
    IonToolbar, IonButton,
    IonButtons, IonItem,
    IonAvatar, IonLabel, 
    IonGrid, IonRow,
    IonCol, IonFooter
  ]
})
export class UserDetailsModalComponent implements OnInit {
  @Input() user: User | undefined;  // Use the User interface for type-checking

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    if (!this.user) {
      console.error('User data is not passed to the modal');
    }
  }

  // Close the modal
  closeModal() {
    this.modalController.dismiss();
  }

}
