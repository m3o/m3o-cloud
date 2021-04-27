import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyListerComponent } from './property-lister.component';

describe('PropertyListerComponent', () => {
  let component: PropertyListerComponent;
  let fixture: ComponentFixture<PropertyListerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyListerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
