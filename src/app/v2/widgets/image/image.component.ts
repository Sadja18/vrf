import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Camera,
  CameraDirection,
  CameraResultType,
  CameraSource,
} from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ModalController, IonicModule, ToastController } from '@ionic/angular';
import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';
import { CommonModule } from '@angular/common';

import { CameraPreview } from '@capacitor-community/camera-preview';
import { CameraModalComponent } from '../camera-modal/camera-modal.component';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ImageComponent implements OnInit {
  @Input() initialBase64: string = ''; // This will receive the base64 string from preview screen
  @Output() imagePath: EventEmitter<string> = new EventEmitter<string>();

  previewPic: string = ''; // Holds the base64 preview of the image
  isModalOpen: boolean = false; // Flag to toggle modal visibility

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
  ) {}

  isBase64(str: string): boolean {
    const regex = /^data:((?:\w+\/(?:(?!;).)+)?)((?:;[\w=]*[^;])*),(.+)$/;
    return regex.test(str);
  }
  async showToast(message: string, type: string) {
    const color =
      type === 'success' ? 'green' : type === 'info' ? 'yellow' : 'red';
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      cssClass: `custom-toast-${type}`,
    });
    toast.present();
  }

  // async takePicture() {
  //   try {
  //     // Start the camera with the front-facing direction
  //     await CameraPreview.start({
  //       position: 'front', // or 'rear'
  //       parent: 'cameraPreview', // Container for the camera
  //       className: 'camera-preview', // Optional for styling
        
  //     });

  //     // Capture the photo
  //     const photo = await CameraPreview.capture({
  //       quality: 90,
  //       height: 300,
  //       width: 300,
  //     });

  //     // Convert captured photo to Base64
  //     if (photo?.value) {
  //       this.previewPic = `data:image/jpeg;base64,${photo.value}`;
  //       this.imagePath.emit(this.previewPic); // Emit Base64 string
  //     }

  //     // Stop the camera after the photo is taken
  //     await CameraPreview.stop();
  //     // const photo = await Camera.getPhoto({
  //     //   quality: 90,
  //     //   resultType: CameraResultType.Base64, // Return the URI of the image
  //     //   source: CameraSource.Prompt,
  //     //   allowEditing: false,
  //     //   saveToGallery: false,
  //     // });

  //     // // Save the photo with a new name based on the timestamp
  //     // this.previewPic = `data:image/jpeg;base64,${photo.base64String}`; // Construct the Base64 URL
  //     // // console.log('previewPic ', this.previewPic);
  //     // this.imagePath.emit(this.previewPic); // Emit the Base64 string
  //   } catch (error) {
  //     console.error('Error capturing photo: ', error);
  //   }
  // }

  async openCameraModal() {
    const modal = await this.modalController.create({
      component: CameraModalComponent, // The modal component for the camera preview
      cssClass: 'camera-modal', // Optional: Add custom CSS for modal styling
    });
  
    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.previewPic = result.data; // Get the Base64 string
        this.imagePath.emit(this.previewPic); // Emit to parent
      }
    });
  
    await modal.present();
  }

  async pickImage() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64, // Return the URI of the image
        source: CameraSource.Photos,
        allowEditing: false,
        saveToGallery: false,
      });

      const allowedFormats = ['jpeg', 'jpg', 'png'];
      if (!allowedFormats.includes(photo.format)) {
        throw new Error('Only JPG, JPEG, and PNG formats are allowed.');
      }

      // Save the selected photo with a new name based on the timestamp
      this.previewPic = `data:image/jpeg;base64,${photo.base64String}`; // Construct the Base64 URL
      // console.log('previewPic ', this.previewPic);

      this.imagePath.emit(this.previewPic); // Emit the new file URI to the parent component
    } catch (error: any) {
      console.error('Error picking image from gallery: ', error);
      // this.showToast(error.message, 'error'); // Optional: Display error to the user
      this.showToast(error.message, 'error'); // Optional: Display error to the user
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: ImagePreviewModalComponent,
      componentProps: {
        imageUrl: this.previewPic,
      },
    });

    modal.onDidDismiss().then((result) => {
      // Handle modal dismissal (if needed)
    });

    return await modal.present();
  }

  zoomImage() {
    // Open the image in a larger view when the preview is clicked
    this.openModal();
  }

  ngOnInit() {
    if (this.initialBase64 && this.isBase64(this.initialBase64)) {
      this.previewPic = this.initialBase64; // Set the previewPic to the valid base64 passed
    } else {
      console.error('Invalid base64 string passed');
    }
  }
}
