import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CameraPreview } from '@capacitor-community/camera-preview';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera-capture-modal',
  templateUrl: './camera-capture-modal.component.html',
  styleUrls: ['./camera-capture-modal.component.scss'],
  imports: [CommonModule, IonicModule],
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
      width: 400,
      height: 400,
      x: 5, // Align to the left edge
      y: 80, // Align to the top edge
    });
  }

  // Flip between front and rear cameras
  async flipCamera() {
    this.cameraPosition = this.cameraPosition === 'front' ? 'rear' : 'front';
    await CameraPreview.flip();
  }

  getFileName() {
    const date = new Date();

    return `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
  }

  // Check if Directory.External exists
  async checkIfDirectoryExists(): Promise<boolean> {
    try {
      await Filesystem.readdir({
        path: 'Pictures',
        directory: Directory.External,
      });
      return true;
    } catch (error) {
      // Directory does not exist
      console.error('Directory.External does not exist, creating now.');
      return false;
    }
  }

  async captureImage() {
    const capturedImage = await CameraPreview.capture({
      quality: 90,
      width: 400,
      height: 400,
    });

    // Extract the file name from the captured image path
    const cameraFilePath = capturedImage.value;
    const fileName = cameraFilePath.split('/').pop(); // Extract file name
    console.log('Captured image path:', cameraFilePath);
    console.log('Extracted file name:', fileName);

    const targetFileName = `${this.getFileName()}.${fileName?.split('.').pop()}`;

    // Define the target file path
    const targetFilePath = `Pictures/${targetFileName}`;

    // Ensure the Pictures directory exists
    const directoryExists = await this.checkIfDirectoryExists();
    if (!directoryExists) {
      try {
        await Filesystem.mkdir({
          path: 'Pictures',
          directory: Directory.External,
          recursive: true,
        });
      } catch (error) {
        console.error('Error creating directory:', error);
        return;
      }
    }

    // Copy the file from Cache to External
    try {
      const copyResult = await Filesystem.copy({
        from: fileName ?? '', // Source file name (relative to Directory.Cache)
        to: targetFilePath, // Destination path
        directory: Directory.Cache, // Source directory
        toDirectory: Directory.External, // Target directory
      });

      console.log('File successfully copied to:', copyResult.uri);

      CameraPreview.stop();

      // Return the file URI to the parent component
      this.modalCtrl.dismiss({ filePath: copyResult.uri });
    } catch (error) {
      console.error('Error copying file:', error);
    }
  }

  closeModal() {
    CameraPreview.stop();
    this.modalCtrl.dismiss({});
  }
}
