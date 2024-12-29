import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Screen3Page } from './screen3.page';

describe('Screen3Page', () => {
  let component: Screen3Page;
  let fixture: ComponentFixture<Screen3Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Screen3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
