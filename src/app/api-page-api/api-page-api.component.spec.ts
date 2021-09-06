import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiPageApiComponent } from './api-page-api.component';

describe('ApiPageApiComponent', () => {
  let component: ApiPageApiComponent;
  let fixture: ComponentFixture<ApiPageApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiPageApiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiPageApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
