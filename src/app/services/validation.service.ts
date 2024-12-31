import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
    return nameRegex.test(name);
  }

  validateLastName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s]+$/; // Allow only letters and spaces
    return nameRegex.test(name) || name==='';
  }

  validateMobile(mobile: string): boolean {
    const mobileRegex = /^[0-9]{10}$/; // Exactly 10 digits
    return mobileRegex.test(mobile);
  }

  validateDOB(dob: string): boolean {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    const date = new Date(dob);
    const today = new Date();
    return dobRegex.test(dob) && date <= today; // Ensure it's not a future date
  }

  validateGender(gender: string): boolean {
    const validGenders = ['Male', 'Female', 'Other'];
    return validGenders.includes(gender);
  }

  validateEducation(education: string): boolean {
    const validOptions = ['10th', '12th', 'Bachelors', 'Masters', 'Others'];
    return validOptions.includes(education);
  }

  validateAddress(address: string): string {
    const sanitizedAddress = address.replace(/[^a-zA-Z0-9,\-/\s]/g, ''); // Remove special characters except , / -
    return sanitizedAddress;
  }

  validateProfilePic(path: string): boolean {
    return !!path; // Ensure path is not empty
  }

  validateLocation(location: { lat: number; lng: number }): boolean {
    return location.lat >= -90 && location.lat <= 90 && location.lng >= -180 && location.lng <= 180;
  }
}
