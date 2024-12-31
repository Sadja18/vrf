import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ValidationService } from 'src/app/services/validation.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet'; // Leaflet library for map rendering

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
    dateOfBirth: '',
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
  ) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, this.nameValidator.bind(this)]],
      lastName: ['', [, this.lastNameValidator.bind(this)]],
      mobile: ['', [Validators.required, this.mobileValidator.bind(this)]],
      dateOfBirth: [
        '1970-03-03',
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

  nameValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return this.validationService.validateName(control.value)
      ? null
      : { invalidName: true };
  }

  lastNameValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    console.log(control.value);
    return this.validationService.validateName(control.value) ||
      control.value == null ||
      control.value === ''
      ? null
      : { invalidName: true };
  }

  mobileValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return this.validationService.validateMobile(control.value)
      ? null
      : { invalidMobile: true };
  }

  dobValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return this.validationService.validateDOB(control.value)
      ? null
      : { invalidDOB: true };
  }

  genderValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return this.validationService.validateGender(control.value)
      ? null
      : { invalidGender: true };
  }

  educationValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    return this.validationService.validateEducation(control.value)
      ? null
      : { invalidEducation: true };
  }

  addressValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    // control.setValue(this.validationService.validateAddress(control.value));
    // return null; // Address validation modifies the value; always return valid
    const value = control.value;

    if (typeof value !== 'string') {
      return { invalidType: true }; // If value is not a string
    }

    // Allow letters, numbers, spaces, commas, forward slashes, and dashes
    const validPattern = /^[a-zA-Z0-9\s,/-]*$/;

    if (!validPattern.test(value)) {
      return { invalidAddress: true }; // Invalid characters found
    }

    return null; // No errors
  }

  profilePicValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    return this.validationService.validateProfilePic(control.value)
      ? null
      : { invalidProfilePic: true };
  }

  locationValidator(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    return this.validationService.validateLocation(control.value)
      ? null
      : { invalidLocation: true };
  }

  async showToast(message: string, type: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      cssClass: `custom-toast ${type}`,
    });
    toast.present();
  }

  ionViewDidEnter() {
    const p = this.userService.getUserData();
    console.log(p);
    this.initMap();
  }

  async initMap() {
    const currentPosition = await this.getCurrentPosition();
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
          this.userForm?.get('location.lat')?.setValue(position.lat);
          this.userForm?.get('location.lng')?.setValue(position.lng);
          // Update and re-open the popup with the new coordinates
          const roundedLat = position.lat.toFixed(4);
          const roundedLng = position.lng.toFixed(4);

          const newContent = `${roundedLat}, ${roundedLng}`;
          this.marker?.bindPopup(newContent).openPopup();
        }
      }, 300); // Adjust debounce duration as needed
    });
  }

  // Get current geolocation of the user
  async getCurrentPosition() {
    const position = await Geolocation.getCurrentPosition();
    return { lat: position.coords.latitude, lng: position.coords.longitude };
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.showToast('Please fill all required fields correctly.', 'error');
      return;
    }
    console.log(this.userForm);
    this.showToast('Okay to submit', 'success');
    this.userService.setUserData(this.user);
    // Navigate to the preview screen
    this.router.navigate(['/preview']);
  }

  async resetMap() {
    const currentPosition = await this.getCurrentPosition();

    this.map?.setView([currentPosition.lat, currentPosition.lng], 13);
    let newLatLng = new L.LatLng(currentPosition.lat, currentPosition.lng);
    this.marker?.setLatLng(newLatLng);
  }

  onReset() {
    this.userForm.reset();
    this.userForm
      .get('profilePic')
      ?.setValue(
        'data:image/png;base64,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CAmguKoVjQCxcENRVVtY9IJArARQXMUrR4D0YIWiKr6AaAmBVAmguOyVJUD+zwhFZV8stIBArgRQXL0rn32AoKhy/UjgviFQjQCK6z9uWQYIiqraDw69IACB/wiguCSf/40XRcWPPgQg4IpAroor+R0IisrVjwzjQgACvQjkpLiSDBAUFT/YEICAbwI5KK5kAgRF5fvHhetDAAJTEUhVcUUfICgqfmghAIGYCKSkuKIMEBRVTD8uzBUCEJjqWcnY2JiMjo7K+Pi4DA4OytDQkPkayxFNgKCoYllSzBMCEChLIFbFFXyAoKjKLkXaQwACMROISXEFGSAoqpiXP3OHAASaIBDDW1zBBAiKqoklxxgQgECKBEJVXN4DBEWV4nLnniAAAVcEQlJcXgIEReVqaTEuBCCQC4EQFFdrAYKiymVZc58QgEBRAr/++qscdNBBcuaZZ8pjjz1muq1bt06uvPJKee+996Svr08uv/xyufvuu2XGjBnyzz//yC233CLPPvus/PXXX3LKKafIU089JTvttJN5HVhfC9ZXgoeHh80rwdq/c7z//vtyySWXyBFHHCGvvvpq9/v33nuvLFy4ULbffvvu9y644AJ57rnnzJ+ff/55ue2228y89t9/f3nyySfl0EMPNeecBwiKquhSoh0EIJAbgXnz5smKFSvk1FNP7QbI+eefbwLh0UcflV9++UVOPvlkuemmm+SKK66Qhx9+WJ544gl5++23ZZdddpHLLrtMZs6cKS+88EIXXS/Fpe0ffPBBOeCAA+S3337bKkBuvfVW2bBhgzzyyCPb4P/888/l+OOPlzfffFPmzJljrn///ffL119/LTvssIObAEFR5fZjwP1CAAJlCSxZskTuuusuOeOMM8wHse5ANm3aJLvuuqt89913sueee5oh9W/8L730ktmRHHvssXLNNdfI3LlzzblvvvlGDj74YNGdjIbJzjvvbIJHD91tbN68WW6//XZZtWqV2TXoruLLL7/cKkCuvfZaE0a6y5l8aLisXbvW7HI6h87rxRdflBNOOKG5AEFRlV0+tIcABHIloH/jP/LII2Xp0qXyyiuvyA8//GACRD/oNSRURXUO3aGcd9555oN8t912k3feecdoKD22bNliNJX2mzVrlhxyyCHy8ssvyx9//CG6u9Hva6h0Pp/vueceWb16tQmSjuK6+OKLZWRkxOxCVIMdddRRZrey1157ybnnnmvmozugzqHaTOejQVZbYaGocv0R4L4hAIGqBHQHcfjhh8uNN94od955ZzdAPvzwQzn77LPl559/7g798ccfm7/tb9y4Ufr7++WTTz6RAw88sHte/+sT3Z1oIL311lty8803m+cjqptUf0089FraX8/pMw0dT5+H6HOT+fPnGy11/fXXmzb66/TTTzfz0V1K5zjrrLPMfBYsWFAtQFBUVZcN/SAAgdwJvPbaa/LAAw+YD/3ttttuqwDRZw66u9DP2M7x7rvvGmWlf1nXXcMbb7whxxxzjDn9999/mx2Iaqn99tvPfE8fyutzkc8++2wb1Bogn376qQmNqd7i0vDR63z//fdyww03mPksWrSoO9Zxxx1n5nP11VcXDxAUVe7LnvuHAASaIHDhhRfK8uXLu29I6fMLDQJ9SL148WLzDESDZN999zWXU52kz0tUXemHtz7buOqqq8w5DQNVTKqfNEgef/zxrsK69NJLzdtck3cgnQDpfH/lypWy9957Gx2m6ky11EknnWQCRB/Yf/vtt+YZjB76TGX33XeX119/3VzXqrBQVE0sGcaAAAQg0JvARIWlLfSZhL6u+/TTTxuVpc8ctM1FF11kPtB196Jhog++dSegzz40OPTB+9FHHy2qwVRJadh89NFHss8++3QvPHEH0vmmPsTX1351bH1VWHcWX331lbm+PpvRV3r1WY2Ora/86mu9X3zxhdk99QwQFBVLHQIQgEA7BCYHiO4m9JVdDYkdd9xRrrvuOtG3ofTQXYL+Xj/sVTXp8wh9+D4wMCAnnniinHPOOea5ih533HGHqP5SVXbaaafJBx98YHYQGk76rEOVl2qun376yTzjWLZsmVFf+truQw89ZEJFdyT6wP2+++6T9evXy2GHHSbPPPNMV5d1A0Qb6xN4fbCih/559uzZ7RDkKhCAAAQgECyBqf4vLs2LGatXr96iDTTtNMk0hTggAAEIQAACkwnoLkb/vcrvv/9usuJf6hRfD7F13SUAAAAASUVORK5CYII=',
      );
    this.resetMap();
  }

  ngOnInit() {}
}
