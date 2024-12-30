import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { User } from '../models/user.interface';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  imports:[
     IonicModule, CommonModule, FormsModule, ReactiveFormsModule
          // IonHeader, CommonModule, 
  ]
})
export class ConfirmModalComponent  implements OnInit {
  @Input() userData: User | undefined;  // Data to display in the confirmation modal

  constructor(    private modalController: ModalController
  ) { }

  ngOnInit() {}
  dismissModal() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss({ confirmed: true });
  }

}
