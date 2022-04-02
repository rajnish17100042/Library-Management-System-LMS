import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLibrarianComponent } from './update-librarian.component';

describe('UpdateLibrarianComponent', () => {
  let component: UpdateLibrarianComponent;
  let fixture: ComponentFixture<UpdateLibrarianComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLibrarianComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLibrarianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
