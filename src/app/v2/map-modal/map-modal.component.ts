import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import * as L from 'leaflet';
// import {IonContent,IonToolbar, IonTitle, IonHeader, IonCol} from '@ionic/angular/standalone';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  standalone:true,
  imports:[
    CommonModule,
    IonicModule,
    // IonContent,
    // IonTitle,
    // IonHeader,
  ]
 
})
export class MapModalComponent  implements OnInit {

  @Input() location!: { lat: number; lng: number };

  private map: any;

  constructor(private modalController: ModalController) {}
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    this.map = L.map('map').setView([this.location.lat, this.location.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([this.location.lat, this.location.lng])
      .addTo(this.map)
      .bindPopup('User Location')
      .openPopup();
  }

  dismiss() {
    this.modalController.dismiss();
    if (this.map) {
      this.map.remove();
    }
  }
}
