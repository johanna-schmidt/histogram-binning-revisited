import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsPilotComponent } from './results-pilot.component';

describe('ResultsPilotComponent', () => {
  let component: ResultsPilotComponent;
  let fixture: ComponentFixture<ResultsPilotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsPilotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsPilotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
