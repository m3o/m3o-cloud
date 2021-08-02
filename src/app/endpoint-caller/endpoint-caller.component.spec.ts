import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndpointCallerComponent } from './endpoint-caller.component';

describe('EndpointCallerComponent', () => {
  let component: EndpointCallerComponent;
  let fixture: ComponentFixture<EndpointCallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndpointCallerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EndpointCallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
