import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
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
      const isConnection = (await this.sqlite.isConnection('appDB', false)).result;

      if (!isConnection && !retCC) {
        this.db = await this.sqlite.createConnection('appDB', false, 'no-encryption', 1, false);
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

  async addUser(
    firstName: string,
    lastName: string,
    dateOfBirth: string,
    mobile: string,
    address: string,
    profilePic: string,
    gender: string,
    education: string,
    location: Record<string, any>
  ): Promise<void> {
    if (!this.db) throw new Error('Database connection is not open');
    
    const insertQuery = `
      INSERT INTO users (firstName, lastName, dateOfBirth, mobile, address, profilePic, gender, education, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
    try {
      const stringifiedLocation = JSON.stringify(location);
      console.log('stringi ', stringifiedLocation)
      await this.db.run(insertQuery, [
        firstName,
        lastName,
        dateOfBirth,
        mobile,
        address,
        profilePic,
        gender,
        education,
        stringifiedLocation
      ]).then(response=>{
        console.log('db run ', response);
      }).catch(error=>{
        console.log('db save error ', error)
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  async getUsers(): Promise<any[]> {
    if (!this.db) throw new Error('Database connection is not open');
    
    try {
      const result = await this.db.query('SELECT * FROM users;');
      return result.values || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
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
