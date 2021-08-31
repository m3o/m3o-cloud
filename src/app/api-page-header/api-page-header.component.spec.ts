import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageHeaderComponent } from './api-page-header.component';

describe('ApiPageHeaderComponent', () => {
  let component: ApiPageHeaderComponent;
  let fixture: ComponentFixture<ApiPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPageHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
