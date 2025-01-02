import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  IonicModule,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { FullImageModalComponent } from '../full-image-modal/full-image-modal.component';
import { CameraCaptureService } from 'src/app/services/camera-capture.service';
import { CameraCaptureModalComponent } from '../camera-capture-modal/camera-capture-modal.component';

@Component({
  selector: 'app-profile-pic-v2',
  templateUrl: './profile-pic-v2.component.html',
  styleUrls: ['./profile-pic-v2.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class ProfilePicV2Component implements OnInit {
  imagePath: string | null = null;
  base64ImagePath: string = '';
  imagePreview: string = '';

  ngOnInit() {
    // Retrieve the image path from the service
    this.imagePath = this.cameraCaptureService.getImagePath();

    console.log("Image path from service ", this.cameraCaptureService.getImagePath());
  }
  

  constructor(
    private platform: Platform,
    private modalController: ModalController,
    private cameraCaptureService: CameraCaptureService,

  ) {}

  // Open Camera Capture Modal to capture an image
  async openCameraModal() {
    // Navigate to the camera capture screen
    
    const modal = await this.modalController.create({
      component: CameraCaptureModalComponent,
    });

    modal.onDidDismiss().then((data) => {
      console.log('modal dismissed')
      console.log(data)
      console.log(data?.data);
      console.log(data.data.filePath);
      
      if (data.data && data.data.filePath) {
        // Received the file path from Camera Capture Modal
        this.imagePath = data.data.filePath;
        // Ensure that imagePath is not null before calling the function
        if (this.imagePath) {
          this.convertImagePathToPreview(this.imagePath);
        }
      }
    });

    return await modal.present();
  }

  // Convert image path to base64 or valid URI for preview
  async convertImagePathToPreview(filePath: string) {
    try {
      // Read the file from the file system to get the base64 string
      const file = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      // Convert file data to a base64 string for preview
      this.imagePreview = 'data:image/jpeg;base64,' + file.data;
    } catch (error) {
      console.error('Error reading the image file:', error);
    }
  }

  // Open the full image modal
  async openFullImageModal() {
    const modal = await this.modalController.create({
      component: FullImageModalComponent,
      componentProps: { imagePath: this.imagePreview },
    });
    await modal.present();
  }

  // Delete the existing image from Directory.External if it exists
  async deleteExistingImage() {
    if (!this.imagePath) return;

    try {
      const fileName = this.imagePath.split('/').pop();
      console.log(this.imagePath, ' ', 'filename', ' ', fileName);
      if (fileName) {
        await Filesystem.deleteFile({
          path: `Pictures/${fileName}`,
          directory: Directory.External,
        });
        console.log(`Deleted existing image: ${fileName}`);
      }
    } catch (error) {
      console.error('Error deleting existing image: ', error);
    }
  }

  // Pick an image from the gallery
  async pickFromGallery() {
    try {
      // Delete the existing image if it exists
      if (this.imagePath) {
        await this.deleteExistingImage();
      }

      // Request the user to pick an image from the gallery
      const photo = await Camera.getPhoto({
        source: CameraSource.Photos, // Allow selection from the gallery
        resultType: CameraResultType.Uri, // Get the image URI
        quality: 100, // Maximum quality
      });

      // Get the file URI
      const fileUri = photo.webPath;

      // Save the file to the appropriate directory (Directory.External)
      await this.saveImageToDataDirectory(photo);

      if (!fileUri) {
        throw Error('Could not save image');
      }
    } catch (error) {
      console.error('Error picking image: ', error);
    }
  }

  getFileName() {
    const date = new Date();

    return `${date.getDate()}${date.getMonth()}${date.getFullYear()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`;
  }

  // Save the picked image to the Data directory
  async saveImageToDataDirectory(photo: any) {
    try {
      // Ensure Directory.External exists
      const directoryExists = await this.checkIfDirectoryExists();

      // If the directory doesn't exist, create it
      if (!directoryExists) {
        await Filesystem.mkdir({
          path: 'Pictures',
          directory: Directory.External,
          recursive: true, // Ensures it creates all necessary parent directories
        });
      }

      // Extract file extension and name from the URI
      const fileExtension = photo.webPath?.split('.').pop();
      const fileName = `image_${this.getFileName()}.${fileExtension}`;
      // console.log('filename is ', fileName);

      // Convert webPath to base64 or file path
      const file = await Filesystem.readFile({
        path: photo.path!,
        // directory: Directory.External,
      });

      // console.log('converted file is ', file);

      // Write the file to Directory.External
      const result = await Filesystem.writeFile({
        path: `Pictures/${fileName}`,
        data: file.data,
        directory: Directory.External,
        recursive: true,
      });

      console.log(`Image saved to Data directory as ${fileName} ${result.uri}`);
      this.imagePath = result.uri;

      // Convert the image to a base64 string for preview
      const base64Image = `data:image/jpeg;base64,${file.data}`;
      console.log(base64Image);

      // Store the base64 image in a variable that will be used for the image preview
      this.imagePreview = base64Image;
    } catch (error: any) {
      if (
        typeof error == 'object' &&
        !Array.isArray(error) &&
        error.hasOwnProperty('message')
      ) {
        if (
          typeof error.message == 'string' &&
          error.message.includes('Directory exists')
        ) {
          console.warn('Could not create dir because directory already exists');
        } else {
          console.error('Could not create dir because ', error.message);
        }
      } else {
        console.error('Error saving image: ', error);
      }
    }
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
}
