import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageOverviewComponent } from './api-page-overview.component';

describe('ApiPageOverviewComponent', () => {
  let component: ApiPageOverviewComponent;
  let fixture: ComponentFixture<ApiPageOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPageOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPageOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
