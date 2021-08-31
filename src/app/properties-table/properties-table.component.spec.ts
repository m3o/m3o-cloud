import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesTableComponent } from './properties-table.component';

describe('PropertiesTableComponent', () => {
  let component: PropertiesTableComponent;
  let fixture: ComponentFixture<PropertiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
