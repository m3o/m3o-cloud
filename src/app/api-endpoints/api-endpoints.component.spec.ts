import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiEndpointsComponent } from './api-endpoints.component';

describe('ApiEndpointsComponent', () => {
  let component: ApiEndpointsComponent;
  let fixture: ComponentFixture<ApiEndpointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiEndpointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiEndpointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
