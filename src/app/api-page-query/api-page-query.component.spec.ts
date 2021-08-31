import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageQueryComponent } from './api-page-query.component';

describe('ApiPageQueryComponent', () => {
  let component: ApiPageQueryComponent;
  let fixture: ComponentFixture<ApiPageQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPageQueryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPageQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
