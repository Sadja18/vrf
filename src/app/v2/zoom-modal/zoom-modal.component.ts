import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {  IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-zoom-modal',
  templateUrl: './zoom-modal.component.html',
  styleUrls: ['./zoom-modal.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    IonicModule,
    
  ]
})
export class ZoomModalComponent  implements OnInit {

  @Input() profilePic!: string;

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
