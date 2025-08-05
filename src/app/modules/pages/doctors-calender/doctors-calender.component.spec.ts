import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorsCalenderComponent } from './doctors-calender.component';

describe('DoctorsCalenderComponent', () => {
  let component: DoctorsCalenderComponent;
  let fixture: ComponentFixture<DoctorsCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorsCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorsCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
