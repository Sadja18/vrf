import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as L from 'leaflet';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.page.html',
  styleUrls: ['./user-input.page.scss'],
  standalone: false
})
export class UserInputPage implements OnInit {
  userForm: FormGroup;  // FormGroup to manage user input fields
  profilePicBase64: string | undefined;  // Store the base64 of the profile picture
  currentLocation: { lat: number, lng: number } | undefined;  // Store the user's geolocation
  dateOfBirth: string = '2024-12-20';
  map: L.Map | undefined;


  constructor(private formBuilder: FormBuilder, private navCtrl: NavController) {
    // Initialize the form with validation rules
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.maxLength(200)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],  // Mobile number validation (10 digits)
      gender: ['', Validators.required],
      education: ['', Validators.required],
      location: [{ lat: 0, lng: 0 }, Validators.required],  // Location will be updated later
      dateOfBirth: ['2024-12-20', Validators.required],  // Add dateOfBirth field with required validation
    });
  }

  ngOnInit() {
    this.getCurrentLocation();  // Get current location on page load
  }
  initializeMap() {
    // Create the map and set initial view to a default location (if available)
    this.map = L.map('map', {
      center: [51.505, -0.09], // Default center (London)
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }


  ionViewDidEnter() {
    this.initializeMap();

  }

  // Method to get current location using Capacitor Geolocation API
  // Function to get the current location
  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // Update the location in the form
      this.userForm.controls['location'].setValue(`${latitude}, ${longitude}`);

      this.currentLocation = { lat: latitude, lng: longitude };

      // Set map view to current location and add a marker
      if (this.map) {
        // Center map to the user's location
        this.map.setView([latitude, longitude], 13);

        // Remove any existing markers before adding a new one
        this.map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            this.map?.removeLayer(layer);
          }
        });

        // Add a marker at the current location
        L.marker([latitude, longitude]).addTo(this.map)
          .bindPopup('You are here!')
          .openPopup();
      }

    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  // Method to capture profile picture using the device camera
  async captureProfilePic() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl, // Get image as Base64 string
        source: CameraSource.Camera, // Open the camera
      });

      console.log('captured')

      // Save the captured image as a Base64 string
      // console.log(image.base64String)
      this.profilePicBase64 = image.dataUrl;

      console.log('Profile picture captured:', this.profilePicBase64);

    } catch (error) {
      console.error('Error capturing profile picture:', error);
    }
  }

  // Method to submit the form data and navigate to Screen 2 (preview)
  submitForm() {
    if (this.userForm.valid) {
      console.log(this.currentLocation);
      // Prepare the data for submission (form data + profile picture + location)
      const userData = {
        ...this.userForm.value,
        profilePic: this.profilePicBase64,
        location: this.currentLocation,
      };


      console.log('User Data to Submit:', userData);
      // Navigate to Screen 2 (preview)
      // Use NavController to navigate and pass data
      this.navCtrl.navigateForward('/editable-preview', {
        state: { userData: userData }
      });
    } else {
      // Handle form validation error
      console.log('Form is invalid');
    }
  }

  formattedCoords() {

    const value = `Lat: ${this.currentLocation?.lat}
Long: ${this.currentLocation?.lng}`

    return value;
  }

  // Method to reset the form
  resetForm() {
    this.userForm.reset();  // Reset all fields in the form
    this.profilePicBase64 = undefined;  // Clear the profile picture
    this.currentLocation = undefined;  // Clear the location
    this.initializeMap();  // Reinitialize the map
  }

}
