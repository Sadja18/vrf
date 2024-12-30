import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userData: User;
  constructor() {
    this.userData = {
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
   }

   getUserData(): User {
    return this.userData;
  }

  setUserData(user: User): void {
    this.userData = user;
  }
}
