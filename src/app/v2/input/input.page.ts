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
  imagePath: string = ''; // to store image path

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
      lastName: ['', [Validators.required, this.nameValidator.bind(this)]],
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
        '',
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
    const color =
      type === 'success' ? 'green' : type === 'info' ? 'yellow' : 'red';
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color: color,
    });
    toast.present();
  }

  ionViewDidEnter() {
    const p = this.userService.getUserData();
    console.log(p);
  }

  onSubmit() {
    // this.userService.setUserData(this.user);
    // this.router.navigate(['/preview']);
    if (this.userForm.invalid) {
      this.showToast('Please fill all required fields correctly.', 'error');
      return;
    }
    console.log(this.userForm);
    this.showToast('Okay to submit', 'success');
  }

  onReset() {
    this.userForm.reset();
  }

  ngOnInit() {}
}
