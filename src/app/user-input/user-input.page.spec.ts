import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInputPage } from './user-input.page';

describe('UserInputPage', () => {
  let component: UserInputPage;
  let fixture: ComponentFixture<UserInputPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
