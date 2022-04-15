import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineHistoryComponent } from './fine-history.component';

describe('FineHistoryComponent', () => {
  let component: FineHistoryComponent;
  let fixture: ComponentFixture<FineHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FineHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FineHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
