import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
  standalone: false,
})
export class PreviewPage implements OnInit {
  userData: User | undefined;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userData = this.userService.getUserData();
  }

  onEdit(): void {
    // Navigate back to the user form to allow the user to edit
    this.router.navigate(['/user-form']);
  }

  onSave(): void {
    // Perform the save operation to save to SQLite database
    this.saveUserData();
  }

  saveUserData(): void {
    
    console.log('Saving user data:', this.userData);
    // Call your method here, e.g., this.userService.addUser(this.userData);
  }
}
