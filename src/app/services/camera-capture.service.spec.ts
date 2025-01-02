import { TestBed } from '@angular/core/testing';

import { CameraCaptureService } from './camera-capture.service';

describe('CameraCaptureService', () => {
  let service: CameraCaptureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraCaptureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
