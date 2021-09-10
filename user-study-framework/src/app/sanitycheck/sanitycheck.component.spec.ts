import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SanitycheckComponent } from './sanitycheck.component';

describe('SanitycheckComponent', () => {
  let component: SanitycheckComponent;
  let fixture: ComponentFixture<SanitycheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SanitycheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SanitycheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
