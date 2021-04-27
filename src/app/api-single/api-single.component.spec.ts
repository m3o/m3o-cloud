import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiSingleComponent } from './api-single.component';

describe('ApiSingleComponent', () => {
  let component: ApiSingleComponent;
  let fixture: ComponentFixture<ApiSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
