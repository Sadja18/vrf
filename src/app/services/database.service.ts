import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Directory, Filesystem, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initializeDatabase(): Promise<void> {
    try {
      const retCC = (await this.sqlite.checkConnectionsConsistency()).result;
      const isConnection = (await this.sqlite.isConnection('appDB', false))
        .result;

      if (!isConnection && !retCC) {
        this.db = await this.sqlite.createConnection(
          'appDB',
          false,
          'no-encryption',
          1,
          false,
        );
        //
        await this.db.open();
        await this.createTables();
      } else {
        this.db = await this.sqlite.retrieveConnection('appDB', false);
        await this.db.open();
      }
    } catch (error) {
      console.error('Error initializing the database:', error);
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database connection is not open');
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        dateOfBirth TEXT NOT NULL,
        mobile TEXT NOT NULL,
        address TEXT NOT NULL,
        profilePic TEXT NOT NULL,
        gender TEXT NOT NULL,
        education TEXT NOT NULL,
        location TEXT NOT NULL
      );
    `;
    try {
      await this.db.execute(createTableQuery);
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  }

  // // Helper function to save profile picture to filesystem
  // private async saveProfilePicToFile(profilePicBase64: string): Promise<string> {
  //   try {
  //     // Generate a unique file name
  //     const fileName = new Date().getTime() + '.png'; // Using timestamp to generate unique file name
  //     const filePath = Directory.Data + '/Pictures/' + fileName;

  //     // Write the base64 string as a file in the Pictures directory
  //     await Filesystem.writeFile({
  //       path: filePath,
  //       data: profilePicBase64,
  //       directory: Directory.Data,
  //       encoding: Encoding.Base64,
  //     });

  //     return filePath;
  //   } catch (error) {
  //     console.error('Error saving profile picture:', error);
  //     throw new Error('Failed to save profile picture');
  //   }
  // }

  // // Helper function to convert image file to base64
  // private async readProfilePicAsBase64(filePath: string): Promise<string> {
  //   try {
  //     const file = await Filesystem.readFile({
  //       path: filePath,
  //       directory: Directory.Data,
  //       encoding: Encoding.BASE64,
  //     });

  //     return file.data;
  //   } catch (error) {
  //     console.error('Error reading profile picture:', error);
  //     throw new Error('Failed to read profile picture');
  //   }
  // }

  async addUser(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    mobile: string,
    address: string,
    profilePic: string, // Base64 string of the image
    gender: string,
    education: string,
    location: Record<string, any>,
  ): Promise<void> {
    if (!this.db) throw new Error('Database connection is not open');

    const insertQuery = `
      INSERT INTO users (firstName, lastName, dateOfBirth, mobile, address, profilePic, gender, education, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    try {
      // Save profilePic to file system and get the file path
      // const profilePicPath = await this.saveProfilePicToFile(profilePic);
      const profilePicPath = profilePic;


      const stringifiedLocation = JSON.stringify(location);
      await this.db.run(insertQuery, [
        firstName,
        lastName,
        dateOfBirth,
        mobile,
        address,
        profilePicPath, // Save the file path instead of the base64 string
        gender,
        education,
        stringifiedLocation,
      ]);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  async getUsers(): Promise<any[]> {
    if (!this.db) throw new Error('Database connection is not open');

    try {
      const result = await this.db.query('SELECT * FROM users;');
      const users = result.values || [];

      // Convert file paths to base64 strings for profilePic
      for (let user of users) {
        if (user.profilePic) {
          // user.profilePic = await this.readProfilePicAsBase64(user.profilePic);
        }
      }

      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
  async checkMobileExists(mobile: string): Promise<boolean> {
    if (!this.db) throw new Error('Database connection is not open');

    try {
      const result = await this.db.query(
        'SELECT COUNT(*) AS count FROM users WHERE mobile = ?;',
        [mobile],
      );

      // Check if the count is greater than 0, meaning mobile exists
      return result?.values?.[0]?.count > 0;
    } catch (error) {
      console.error('Error checking mobile number:', error);
      return false;
    }
  }

  async clearUsersTable(): Promise<void> {
    if (!this.db) throw new Error('Database connection is not open');
    try {
      const result = await this.db.query('DELETE FROM users;');
      console.log(result);
    } catch (error) {
      console.error('Error deleting users', error);
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      try {
        await this.sqlite.closeConnection('appDB', false);
        this.db = null;
      } catch (error) {
        console.error('Error closing database:', error);
      }
    }
  }
}
