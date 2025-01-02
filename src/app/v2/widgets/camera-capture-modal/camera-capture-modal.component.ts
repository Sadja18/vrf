import { Component, OnInit } from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-capture-modal',
  templateUrl: './camera-capture-modal.component.html',
  styleUrls: ['./camera-capture-modal.component.scss'],
})
export class CameraCaptureModalComponent implements OnInit {
  private cameraPosition: 'front' | 'rear' = 'rear'; // Default to rear camera
  private imageFilePath: string | null = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}
  async ngAfterViewInit() {
    await this.startCamera();
  }

  // Start camera preview
  async startCamera() {
    await CameraPreview.start({
      position: this.cameraPosition, // Start with rear camera by default
      storeToFile: true, // Store captured image to file

      width: 360,
      height: 360,
    });
  }

  // Flip between front and rear cameras
  async flipCamera() {
    this.cameraPosition = this.cameraPosition === 'front' ? 'rear' : 'front';
    await CameraPreview.flip();
  }

  // Capture image and store it in app's directory
  async captureImage() {
    const capturedImage = await CameraPreview.capture({
      quality: 90,
      width: 360,
      height: 360,
    });

    // Store captured image to the app's restricted directory
    const timestamp = new Date().toISOString();
    const filePath = `${Directory.Data}/${timestamp}.jpg`;

    await Filesystem.writeFile({
      path: filePath,
      data: capturedImage.value,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    // Return the file path to the parent component
    this.modalCtrl.dismiss({ filePath });
  }
}
