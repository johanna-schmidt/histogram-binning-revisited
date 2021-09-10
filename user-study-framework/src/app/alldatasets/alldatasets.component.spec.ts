import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDatasetsComponent } from './alldatasets.component';

describe('AllDatasetsComponent', () => {
  let component: AllDatasetsComponent;
  let fixture: ComponentFixture<AllDatasetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllDatasetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
