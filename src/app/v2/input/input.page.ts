import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet'; // Leaflet library for map rendering
import { DatabaseService } from 'src/app/services/database.service';

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
    dateOfBirth: '1970-03-03',
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
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, this.nameValidator.bind(this)]],
      lastName: ['', [, this.lastNameValidator.bind(this)]],
      mobile: ['', [Validators.required, this.mobileValidator.bind(this)]],
      dateOfBirth: [
        '1970-12-',
        [Validators.required, this.dobValidator.bind(this)],
      ],
      gender: ['', [Validators.required, this.genderValidator.bind(this)]],
      education: [
        '',
        [Validators.required, this.educationValidator.bind(this)],
      ],
      address: ['', [Validators.required, this.addressValidator.bind(this)]],
      profilePic: [
        'data:image/png;base64,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CAmguKoVjQCxcENRVVtY9IJArARQXMUrR4D0YIWiKr6AaAmBVAmguOyVJUD+zwhFZV8stIBArgRQXL0rn32AoKhy/UjgviFQjQCK6z9uWQYIiqraDw69IACB/wiguCSf/40XRcWPPgQg4IpAroor+R0IisrVjwzjQgACvQjkpLiSDBAUFT/YEICAbwI5KK5kAgRF5fvHhetDAAJTEUhVcUUfICgqfmghAIGYCKSkuKIMEBRVTD8uzBUCEJjqWcnY2JiMjo7K+Pi4DA4OytDQkPkayxFNgKCoYllSzBMCEChLIFbFFXyAoKjKLkXaQwACMROISXEFGSAoqpiXP3OHAASaIBDDW1zBBAiKqoklxxgQgECKBEJVXN4DBEWV4nLnniAAAVcEQlJcXgIEReVqaTEuBCCQC4EQFFdrAYKiymVZc58QgEBRAr/++qscdNBBcuaZZ8pjjz1muq1bt06uvPJKee+996Svr08uv/xyufvuu2XGjBnyzz//yC233CLPPvus/PXXX3LKKafIU089JTvttJN5HVhfC9ZXgoeHh80rwdq/c7z//vtyySWXyBFHHCGvvvpq9/v33nuvLFy4ULbffvvu9y644AJ57rnnzJ+ff/55ue2228y89t9/f3nyySfl0EMPNeecBwiKquhSoh0EIJAbgXnz5smKFSvk1FNP7QbI+eefbwLh0UcflV9++UVOPvlkuemmm+SKK66Qhx9+WJ544gl5++23ZZdddpHLLrtMZs6cKS+88EIXXS/Fpe0ffPBBOeCAA+S3337bKkBuvfVW2bBhgzzyyCPb4P/888/l+OOPlzfffFPmzJljrn///ffL119/LTvssIObAEFR5fZjwP1CAAJlCSxZskTuuusuOeOMM8wHse5ANm3aJLvuuqt89913sueee5oh9W/8L730ktmRHHvssXLNNdfI3LlzzblvvvlGDj74YNGdjIbJzjvvbIJHD91tbN68WW6//XZZtWqV2TXoruLLL7/cKkCuvfZaE0a6y5l8aLisXbvW7HI6h87rxRdflBNOOKG5AEFRlV0+tIcABHIloH/jP/LII2Xp0qXyyiuvyA8//GACRD/oNSRURXUO3aGcd9555oN8t912k3feecdoKD22bNliNJX2mzVrlhxyyCHy8ssvyx9//CG6u9Hva6h0Pp/vueceWb16tQmSjuK6+OKLZWRkxOxCVIMdddRRZrey1157ybnnnmvmozugzqHaTOejQVZbYaGocv0R4L4hAIGqBHQHcfjhh8uNN94od955ZzdAPvzwQzn77LPl559/7g798ccfm7/tb9y4Ufr7++WTTz6RAw88sHte/+sT3Z1oIL311lty8803m+cjqptUf0089FraX8/pMw0dT5+H6HOT+fPnGy11/fXXmzb66/TTTzfz0V1K5zjrrLPMfBYsWFAtQFBUVZcN/SAAgdwJvPbaa/LAAw+YD/3ttttuqwDRZw66u9DP2M7x7rvvGmWlf1nXXcMbb7whxxxzjDn9999/mx2Iaqn99tvPfE8fyutzkc8++2wb1Bogn376qQmNqd7i0vDR63z//fdyww03mPksWrSoO9Zxxx1n5nP11VcXDxAUVe7LnvuHAASaIHDhhRfK8uXLu29I6fMLDQJ9SL148WLzDESDZN999zWXU52kz0tUXemHtz7buOqqq8w5DQNVTKqfNEgef/zxrsK69NJLzdtck3cgnQDpfH/lypWy9957Gx2m6ky11EknnWQCRB/Yf/vtt+YZjB76TGX33XeX119/3VzXqrBQVE0sGcaAAAQg0JvARIWlLfSZhL6u+/TTTxuVpc8ctM1FF11kPtB196Jhog++dSegzz40OPTB+9FHHy2qwVRJadh89NFHss8++3QvPHEH0vmmPsTX1351bH1VWHcWX331lbm+PpvRV3r1WY2Ora/86mu9X3zxhdk99QwQFBVLHQIQgEA7BCYHiO4m9JVdDYkdd9xRrrvuOtG3ofTQXYL+Xj/sVTXp8wh9+D4wMCAnnniinHPOOea5ih533HGHqP5SVXbaaafJBx98YHYQGk76rEOVl2qun376yTzjWLZsmVFf+truQw89ZEJFdyT6wP2+++6T9evXy2GHHSbPPPNMV5d1A0Qb6xN4fbCih/559uzZ7RDkKhCAAAQgECyBqf4vLs2LGatXr96iDTTtNMk0hTggAAEIQAACkwnoLkb/vcrvv/9usuJf6hRfD7F13SUAAAAASUVORK5CYII=',
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
    console.log(control.value);
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
    const dob = control.value;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const date = new Date(dob);
    const today = new Date();

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
    const storedUserData = this.userService.getUserData();
    console.log(storedUserData);
    if (storedUserData) {
      this.userForm.patchValue(storedUserData); // Populate the form with existing data
      const location = storedUserData.location;
      this.resetLocation(location);
    }

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
          console.log('dragend position');
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

  convertUserFormToUserData(): User {
    this.user.firstName = this.userForm.get('firstName')?.value;
    this.user.lastName = this.userForm.get('lastName')?.value;
    this.user.dateOfBirth = this.userForm.get('firstName')?.value;
    this.user.address = this.userForm.get('address')?.value;
    this.user.mobile = this.userForm.get('mobile')?.value;
    this.user.education = this.userForm.get('education')?.value;
    this.user.gender = this.userForm.get('gender')?.value;
    this.user.location.lat = this.userForm.get('location')?.get('lat')?.value;
    this.user.location.lng = this.userForm.get('location')?.get('lng')?.value;

    this.user.profilePic = this.userForm.get('profilePic')?.value;

    console.log(
      'updated user ',
      this.user,
      ' ',
      this.userForm.get('location')?.get('lat')?.value,
      ' ',
      this.userForm.get('location')?.get('lng')?.value,
    );

    return this.user;
  }

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

    return errorMessages[errorKey] || 'Invalid input';
  }

  async onSubmit() {
    if (this.userForm.invalid) {
      // Loop through the form controls and gather all error messages
      let errorMessages: string[] = [];

      Object.keys(this.userForm.controls).forEach((key) => {
        const control = this.userForm.get(key);
        if (control && control.errors) {
          const errors = control.errors;
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

    this.user = this.convertUserFormToUserData();

    this.userService.setUserData(this.user);
    // Navigate to the preview screen
    // this.router.navigate(['/preview']);
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
    this.resetMap();
  }

  ngOnInit() {}
}
