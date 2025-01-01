import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessorService {

  private readonly folderName = 'Pictures'; // Folder inside Directory.DATA

  constructor() {}

  /**
   * Ensures the Pictures directory exists, creating it if necessary.
   * @returns A promise that resolves once the directory is guaranteed to exist.
   */
  private async ensureDirectoryExists(): Promise<void> {
    try {
      const folderPath = `${Directory.Data}/${this.folderName}`;

      // Check if the directory exists. If not, create it.
      await Filesystem.mkdir({
        path: folderPath,
        directory: Directory.Data,
        recursive: true, // Create nested directories if needed
      });
    } catch (error:any) {
      // console.error('Error ensuring directory exists:', error);
      // console.error(error.message)
      if (!error.message.includes('Directory exists')){
        throw error;
      }else{
        console.warn('directory exists');
      }

      // throw error;
    }
  }

  /**
   * Converts a Base64 string to a file and saves it to the Pictures directory inside Directory.DATA.
   * @param base64String The Base64 string to convert.
   * @returns The local file path where the file is saved.
   */
  async convertBase64AndSaveFile(base64String: string): Promise<string> {
    try {
      // Ensure the directory exists before saving the file
      await this.ensureDirectoryExists();

      // Extract the file extension from the Base64 string
      const matches = base64String.match(/^data:(image\/\w+);base64,/);
      if (!matches || matches.length !== 2) {
        throw new Error('Invalid Base64 string');
      }
      const fileExtension = matches[1].split('/')[1]; // Extract "jpeg", "png", etc.

      // Remove Base64 header
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

      // Generate a file name based on the current datetime
      const currentDatetime = new Date().toISOString().replace(/[:.-]/g, ''); // e.g., 20250101123000
      const fileName = `${currentDatetime}.${fileExtension}`;

      // Construct the full file path
      const filePath = `${Directory.Data}/${this.folderName}/${fileName}`;

      // Write the file to the specified directory
      const result = await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      console.log('file write result ', result);

      return filePath;
    } catch (error) {
      console.error('Error saving Base64 image:', error);
      throw error;
    }
  }

  /**
   * Converts a local file path into a web-compatible path for use in img tags.
   * @param filePath The local file path to convert.
   * @returns A web-compatible path.
   */
  async getWebPath(filePath: string): Promise<string> {
    try {
      const fileUri = await Filesystem.getUri({
        path: filePath,
        directory: Directory.Data,
      });

      return fileUri.uri; // Return the web-compatible URI
    } catch (error) {
      console.error('Error converting file path to web path:', error);
      throw error;
    }
  }
}
