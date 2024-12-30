import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user.interface';
import { ModalController } from '@ionic/angular';
import { ZoomModalComponent } from '../zoom-modal/zoom-modal.component';
import { MapModalComponent } from '../map-modal/map-modal.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
  standalone: false
})
export class UserCardComponent implements OnInit {
  @Input() user!: User;



  constructor(private modalController: ModalController) { }

  ngOnInit() { }

// Open Profile Picture Modal
async openProfileZoom() {
  const modal = await this.modalController.create({
    component: ZoomModalComponent,
    componentProps: { profilePic: this.user.profilePic },
  });
  return await modal.present();
}

// Open Map Modal
async openMap() {
  const modal = await this.modalController.create({
    component: MapModalComponent,
    componentProps: { location: this.user.location },
  });
  return await modal.present();
}

}
