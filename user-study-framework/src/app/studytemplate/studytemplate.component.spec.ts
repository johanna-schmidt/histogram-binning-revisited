import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudytemplateComponent } from './studytemplate.component';

describe('StudytemplateComponent', () => {
  let component: StudytemplateComponent;
  let fixture: ComponentFixture<StudytemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudytemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudytemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
