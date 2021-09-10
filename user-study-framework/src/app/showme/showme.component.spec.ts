import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowmeComponent } from './showme.component';

describe('ShowmeComponent', () => {
  let component: ShowmeComponent;
  let fixture: ComponentFixture<ShowmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
