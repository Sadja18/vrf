export interface User {
    firstName: string;
    lastName: string;
    mobile: string;
    profilePic: string;  // Base64 string for the profile picture
    gender: string;
    education: string;
    location: { lat: number; lng: number };
    dateOfBirth: string;  // Date of Birth in YYYY-MM-DD format
    address: string,
  }
  