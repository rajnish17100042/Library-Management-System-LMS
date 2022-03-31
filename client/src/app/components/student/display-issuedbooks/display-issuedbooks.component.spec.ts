import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayIssuedbooksComponent } from './display-issuedbooks.component';

describe('DisplayIssuedbooksComponent', () => {
  let component: DisplayIssuedbooksComponent;
  let fixture: ComponentFixture<DisplayIssuedbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayIssuedbooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayIssuedbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
