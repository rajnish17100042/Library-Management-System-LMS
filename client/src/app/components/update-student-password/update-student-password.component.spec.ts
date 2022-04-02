import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentPasswordComponent } from './update-student-password.component';

describe('UpdateStudentPasswordComponent', () => {
  let component: UpdateStudentPasswordComponent;
  let fixture: ComponentFixture<UpdateStudentPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStudentPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
