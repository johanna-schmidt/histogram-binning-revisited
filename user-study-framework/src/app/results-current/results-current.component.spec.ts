import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsCurrentComponent } from './results-current.component';

describe('ResultsCurrentComponent', () => {
  let component: ResultsCurrentComponent;
  let fixture: ComponentFixture<ResultsCurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsCurrentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
