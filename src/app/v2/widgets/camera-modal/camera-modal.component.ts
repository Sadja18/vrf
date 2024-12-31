import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-modal',
  templateUrl: './camera-modal.component.html',
  styleUrls: ['./camera-modal.component.scss'],
  imports: [
    CommonModule,IonicModule
  ]
})
export class CameraModalComponent implements OnInit {
  constructor(private modalCtrl: ModalController) {}

  async ngOnInit() {
    await CameraPreview.start({
      position: 'front',
      parent: 'cameraPreview',
      className: 'camera-preview',
      width: 360,
      height: 360,
      disableExifHeaderStripping:false,
    });
  }

  async captureImage() {
    const photo = await CameraPreview.capture({
      quality: 90,
      height:360,
      width: 360,
    });
    await CameraPreview.stop(); // Stop the camera
    this.modalCtrl.dismiss(`data:image/jpeg;base64,${photo.value}`); // Return Base64
  }

  async flipCamera(){
    CameraPreview.flip();
  }

  async closeCamera() {
    await CameraPreview.stop(); // Stop the camera
    this.modalCtrl.dismiss(); // Close the modal without returning data
  }
}
