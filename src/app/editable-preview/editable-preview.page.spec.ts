import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditablePreviewPage } from './editable-preview.page';

describe('EditablePreviewPage', () => {
  let component: EditablePreviewPage;
  let fixture: ComponentFixture<EditablePreviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditablePreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
