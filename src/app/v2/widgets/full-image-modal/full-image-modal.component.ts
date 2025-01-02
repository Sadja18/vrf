import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-full-image-modal',
  templateUrl: './full-image-modal.component.html',
  styleUrls: ['./full-image-modal.component.scss'],
  imports:[
    CommonModule,
    IonicModule
  ]
})
export class FullImageModalComponent  implements OnInit {

  @Input() imagePath: string | null = null;

  constructor(private modalController: ModalController) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

}
