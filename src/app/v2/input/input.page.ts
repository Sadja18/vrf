import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';

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
  constructor(private userService: UserService, private router: Router) { }

  onSubmit() {
    this.userService.setUserData(this.user);
    this.router.navigate(['/preview']);
  }

  onReset() {
    this.user = {
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

  ngOnInit() {
  }

}
