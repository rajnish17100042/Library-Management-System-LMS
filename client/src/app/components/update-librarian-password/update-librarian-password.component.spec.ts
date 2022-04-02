import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLibrarianPasswordComponent } from './update-librarian-password.component';

describe('UpdateLibrarianPasswordComponent', () => {
  let component: UpdateLibrarianPasswordComponent;
  let fixture: ComponentFixture<UpdateLibrarianPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLibrarianPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLibrarianPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
