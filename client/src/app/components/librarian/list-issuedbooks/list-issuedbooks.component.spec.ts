import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIssuedbooksComponent } from './list-issuedbooks.component';

describe('ListIssuedbooksComponent', () => {
  let component: ListIssuedbooksComponent;
  let fixture: ComponentFixture<ListIssuedbooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListIssuedbooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIssuedbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
