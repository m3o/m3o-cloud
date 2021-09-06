import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageNavigationComponent } from './api-page-navigation.component';

describe('ApiPageNavigationComponent', () => {
  let component: ApiPageNavigationComponent;
  let fixture: ComponentFixture<ApiPageNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPageNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPageNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
