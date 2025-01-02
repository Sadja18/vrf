import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CameraCaptureService {
  private imagePath: string | null = null;

  constructor() {}

  setImagePath(path: string) {
    this.imagePath = path;
  }

  getImagePath(): string | null {
    return this.imagePath;
  }
}
