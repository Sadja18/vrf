import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { ModalController, IonicModule } from '@ionic/angular';
import { ImagePreviewModalComponent } from '../image-preview-modal/image-preview-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class ImageComponent implements OnInit {
  @Input() initialBase64: string = '';  // This will receive the base64 string from preview screen
  @Output() imagePath: EventEmitter<string> = new EventEmitter<string>();


  previewPic: string = ''; // Holds the base64 preview of the image
  isModalOpen: boolean = false; // Flag to toggle modal visibility

  constructor(private modalController: ModalController) {}

  isBase64(str: string): boolean {
    const regex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}(?:[AEIMQUYcgkosw048]?)|\d{2})?$/i;
    return regex.test(str);
  }
  

  async takePicture() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64, // Return the URI of the image
        source: CameraSource.Camera,
        allowEditing: false,
        saveToGallery: false,
      });

      // Save the photo with a new name based on the timestamp
      this.previewPic = `data:image/jpeg;base64,${photo.base64String}`; // Construct the Base64 URL
      console.log('previewPic ', this.previewPic);
      this.imagePath.emit(this.previewPic); // Emit the Base64 string
    } catch (error) {
      console.error('Error capturing photo: ', error);
    }
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

      // Save the selected photo with a new name based on the timestamp

      this.previewPic = `data:image/jpeg;base64,${photo.base64String}`; // Construct the Base64 URL
      console.log('previewPic ', this.previewPic);

      this.imagePath.emit(this.previewPic); // Emit the new file URI to the parent component
    } catch (error) {
      console.error('Error picking image from gallery: ', error);
    }
  }

  // async saveFile(photo: any) {
  //   // console.log('p-1');
  //   try {
  //     // validate if photo path is valid
  //     await Filesystem.stat({ path: photo.path });
  //   } catch (error) {
  //     throw error;
  //   }

  //   try {
  //     try {
  //       // validate if directory exists for app
  //       await Filesystem.readdir({
  //         path: 'Pictures',
  //         directory: Directory.Data,
  //       });
  //     } catch (error) {
  //       try {
  //         // if destination path not exists
  //         // create
  //         await Filesystem.mkdir({
  //           path: 'Pictures',
  //           directory: Directory.Data,
  //           recursive: true,
  //         });
  //       } catch (error) {
  //         throw error;
  //       }
  //     }

  //     const fileName = new Date().getTime() + '.' + photo.format; // New file name based on the current timestamp

  //     // Copy the file from the original path to the new directory
  //     const savedFile = await Filesystem.copy({
  //       from: photo.path, // Original file path
  //       to: `Pictures/${fileName}`, // New file path with generated filename
  //       toDirectory: Directory.Data, // Destination directory to save file
  //     });

  //     // Validate if file was successfully copied.
  //     await Filesystem.stat({ path: savedFile.uri });

  //     return savedFile;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
