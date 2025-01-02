import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet'; // Leaflet library for map rendering
import { DatabaseService } from 'src/app/services/database.service';
import { NavigationState } from 'src/app/models/navigation.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
  standalone: false,
})
export class InputPage implements OnInit {
  user: User = {
    firstName: '',
    lastName: '',
    mobile: '',
    profilePic: '',
    gender: '',
    education: '',
    location: { lat: 0, lng: 0 },
    dateOfBirth: '1970-12-03',
    address: '',
  };

  map: L.Map | undefined;
  marker: L.Marker | undefined;

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private validationService: ValidationService,
    private toastController: ToastController,
    private router: Router,
    private databaseService: DatabaseService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, this.nameValidator.bind(this)]],
      lastName: ['', [, this.lastNameValidator.bind(this)]],
      mobile: ['', [Validators.required, this.mobileValidator.bind(this)]],
      dateOfBirth: [
        '1970-12-03',
        [Validators.required, this.dobValidator.bind(this)],
      ],
      gender: ['', [Validators.required, this.genderValidator.bind(this)]],
      education: [
        '',
        [Validators.required, this.educationValidator.bind(this)],
      ],
      address: ['', [Validators.required, this.addressValidator.bind(this)]],
      profilePic: [
        'data:image/png;base64,   iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
        [Validators.required, this.profilePicValidator.bind(this)],
      ],
      location: this.fb.group({
        lat: [0],
        lng: [0],
      }),
    });
  }

  nameValidator(control: AbstractControl): { [key: string]: string } | null {
    return this.validationService.validateName(control.value)
      ? null
      : { invalidName: 'Invalid name format' };
  }

  lastNameValidator(
    control: AbstractControl,
  ): { [key: string]: string } | null {
    // console.log(control.value);
    if (this.validationService.validateName(control.value)) {
      return null;
    }

    if (control.value == null || control.value === '') {
      return null; // Allow empty last name
    }

    return { invalidName: 'Invalid last name format' };
  }

  mobileValidator(control: AbstractControl): { [key: string]: string } | null {
    return this.validationService.validateMobile(control.value)
      ? null
      : { invalidMobile: 'Invalid mobile number' };
  }

  genderValidator(control: AbstractControl): { [key: string]: string } | null {
    return this.validationService.validateGender(control.value)
      ? null
      : { invalidGender: 'Invalid gender selected' };
  }

  educationValidator(
    control: AbstractControl,
  ): { [key: string]: string } | null {
    return this.validationService.validateEducation(control.value)
      ? null
      : { invalidEducation: 'Invalid education level' };
  }

  addressValidator(control: AbstractControl): { [key: string]: string } | null {
    const value = control.value;

    if (typeof value !== 'string') {
      return { invalidType: 'Address must be a string' };
    }

    const validPattern = /^[a-zA-Z0-9\s,/-]*$/;

    if (!validPattern.test(value)) {
      return { invalidAddress: 'Invalid address format' };
    }

    return null; // No errors
  }

  profilePicValidator(
    control: AbstractControl,
  ): { [key: string]: string } | null {
    return this.validationService.validateProfilePic(control.value)
      ? null
      : { invalidProfilePic: 'Profile picture is invalid' };
  }

  locationValidator(
    control: AbstractControl,
  ): { [key: string]: string } | null {
    return this.validationService.validateLocation(control.value)
      ? null
      : { invalidLocation: 'Location is invalid' };
  }

  dobValidator(control: AbstractControl): { [key: string]: string } | null {
    let dob = control.value;

    if (dob?.includes('T')) {
      dob = dob.split('T')[0];
    }
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const date = new Date(dob);
    const today = new Date();

    // console.log(dob);

    if (!dobRegex.test(dob)) {
      return { invalidDOB: 'Date of Birth must be in YYYY-MM-DD format' };
    }

    if (date > today) {
      return { invalidDOB: 'Date of Birth cannot be a future date' };
    }

    // Calculate age based on the date of birth
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    // Adjust age if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    // Ensure the person is at least 10 years old
    if (age < 10) {
      return { invalidDOB: 'You must be at least 10 years old' };
    }

    return null; // Valid date of birth
  }

  async showToast(message: string, type: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      cssClass: `custom-toast-${type}`,
    });
    toast.present();
  }

  ionViewDidEnter() {
    
    this.initMap();
  }

  async resetLocation(location: { lat: number; lng: number }): Promise<void> {
    // Check if the location is valid (not 0,0 or empty)
    if (location.lat !== 0 && location.lng !== 0) {
      // Location is already set from preview, use it
      this.userForm.get('location.lat')?.setValue(location.lat);
      this.userForm.get('location.lng')?.setValue(location.lng);
    } else {
      // If location is not valid, reset it to current location
      const position = await this.getCurrentLocation();

      this.userForm.get('location')?.get('lat')?.setValue(position.lat);
      this.userForm.get('location')?.get('lng')?.setValue(position.lng);
    }
  }

  async initMap() {
    const currentPosition = await this.getCurrentLocation();
    // console.log('called init map ', currentPosition);
    const mapLat =
      this.userForm?.get('location')?.value.lat || currentPosition.lat;
    const mapLng =
      this.userForm?.get('location')?.value.lng || currentPosition.lng;

    this.map = L.map('mapInput').setView([mapLat, mapLng], 13);

    // console.log('initialized map ', this.map.getCenter());

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: 'assets/icon/map_marker.jpeg',
      iconSize: [25, 41], // Width, Height
      iconAnchor: [12, 41], // Point of the icon that corresponds to the marker's location
      popupAnchor: [0, -41], // Point from which the popup opens relative to the iconAnchor
    });

    // console.log('added title layer to map');

    const contentToDisplay = `${mapLat.toFixed(4)}, ${mapLng.toFixed(4)}`;

    this.marker = L.marker([mapLat, mapLng], {
      draggable: true,
      icon: customIcon,
    })
      .addTo(this.map)
      .bindPopup(contentToDisplay)
      .openPopup();

    console.log('added marker to map ');
    let updateTimeout: any;

    // Emit the coordinates when the marker is dragged
    this.marker.on('dragend', () => {
      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        const position = this.marker?.getLatLng();
        if (position) {
          // console.log('dragend position');
          this.userForm?.get('location.lat')?.setValue(position.lat);
          this.userForm?.get('location.lng')?.setValue(position.lng);
          // Update and re-open the popup with the new coordinates
          const roundedLat = position.lat.toFixed(4);
          const roundedLng = position.lng.toFixed(4);

          const newContent = `${roundedLat}, ${roundedLng}`;
          console.log(
            'dragend position ',
            this.userForm.get('location')?.value,
          );

          this.marker?.bindPopup(newContent).openPopup();
        }
      }, 300); // Adjust debounce duration as needed
    });
  }

  // Get current geolocation of the user
  async getCurrentLocation() {
    const position = await Geolocation.getCurrentPosition();
    console.log('current position');
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  // convertUserFormToUserData(): User {

  //   console.log(
  //     'updated user ',
  //     this.user,
  //     ' ',
  //     this.userForm.get('location')?.get('lat')?.value,
  //     ' ',
  //     this.userForm.get('location')?.get('lng')?.value,
  //   );

  //   return this.user;
  // }

  // Helper method to get the error message based on the key
  getErrorMessage(errorKey: string): string {
    const errorMessages: { [key: string]: string } = {
      invalidName: 'Invalid name format',
      invalidLastName: 'Invalid last name format',
      invalidMobile: 'Invalid mobile number',
      invalidGender: 'Invalid gender selected',
      invalidEducation: 'Invalid education level',
      invalidAddress: 'Invalid address format',
      invalidProfilePic: 'Profile picture is invalid',
      invalidLocation: 'Location is invalid',
      invalidDOB: 'Invalid Date of Birth',
      invalidType: 'Address must be a string',
    };

    return errorMessages[errorKey] || 'Invalid input' + ` ${errorKey}`;
  }

  // This method will be called whenever the profile picture is updated
  onImageSelected(event: { imagePath: string; imagePreview: string }) {
    this.userForm.get('profilePic')?.setValue(event.imagePath);
    // If you need to store the preview path, you can do so as well
    // console.log('Image path:', event.imagePath);
    // console.log('Preview path:', event.imagePreview);
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      // Loop through the form controls and gather all error messages
      let errorMessages: string[] = [];

      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control && control.errors) {
          const errors = control.errors;
          // console.log(errors);
          for (const errorKey in errors) {
            if (errors.hasOwnProperty(errorKey)) {
              // Push the error message to the array
              errorMessages.push(this.getErrorMessage(errorKey));
            }
          }
        }
      });

      // Show the first error message (or display all)
      this.showToast(errorMessages.join(', '), 'error');
      return;
    }

    console.log(this.userForm);
    const mobileNumber = this.userForm.get('mobile')?.value;

    // Check if the mobile number exists in the database
    const mobileExists =
      await this.databaseService.checkMobileExists(mobileNumber);

    if (mobileExists) {
      this.showToast('This mobile number is already registered.', 'error');
      return; // Exit without proceeding if the mobile number exists
    }
    this.showToast('All entries are valid to submit', 'success');

    const user: User = {
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      dateOfBirth: this.userForm.get('dateOfBirth')?.value,
      address: this.userForm.get('address')?.value,
      mobile: this.userForm.get('mobile')?.value,
      education: this.userForm.get('education')?.value,
      gender: this.userForm.get('gender')?.value,
      location: {
        lat: this.userForm.get('location')?.get('lat')?.value,
        lng: this.userForm.get('location')?.get('lng')?.value,
      },
      profilePic: this.userForm.get('profilePic')?.value,
    };

    console.log('set users as user ');
    console.log(user);

    this.userService.setUserData(user);
    // this.userForm.reset();
    // this.userForm.get('profilePic')?.setValue('');
    // this.resetMap();

    // Navigate to the preview screen
    this.router.navigate(['/preview']);
  }

  async resetMap() {
    const currentPosition = await this.getCurrentLocation();

    await this.resetLocation(currentPosition);

    this.map?.setView([currentPosition.lat, currentPosition.lng], 13);
    let newLatLng = new L.LatLng(currentPosition.lat, currentPosition.lng);
    this.marker?.setLatLng(newLatLng);
  }

  onReset() {
    this.userForm.reset();
    this.userForm.get('profilePic')?.setValue('');
    this.userService.resetUserData();
    this.resetMap();
  }

  ngOnInit() {
    console.log('ngonit')
    const navigationState = this.activatedRoute.snapshot.data;

    console.log("navigation state", navigationState?.['editForm']);

    if (navigationState?.['editForm']) {
      const storedUserData = this.userService.getUserData();
      // console.log(storedUserData);
      if (storedUserData) {
        this.userForm.patchValue(storedUserData); // Populate the form with existing data
        const location = storedUserData.location;
        this.resetLocation(location);
      }
    }else{
      console.log('normal form');
      this.userForm.reset();
      this.userForm?.get('dob')?.setValue("1970-03-28");
      this.userService.resetUserData();
    }
  }
}
