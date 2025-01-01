import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userData: User;
  constructor() {
    this.userData = {
      firstName: '',
      lastName: '',
      mobile: '',
      profilePic:
        'data:image/png;base64,   iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      gender: '',
      education: '',
      location: { lat: 0, lng: 0 },
      dateOfBirth: '',
      address: '',
    };
  }

  getUserData(): User {
    return this.userData;
  }

  setUserData(user: User): void {
    this.userData = user;
  }

  resetUserData() {
    this.userData = {
      firstName: '',
      lastName: '',
      mobile: '',
      profilePic:
        'data:image/png;base64,   iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
      gender: '',
      education: '',
      location: { lat: 0, lng: 0 },
      dateOfBirth: '1970-12-03',
      address: '',
    };
  }
}
