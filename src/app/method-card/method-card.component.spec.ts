import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodCardComponent } from './method-card.component';

describe('MethodCardComponent', () => {
  let component: MethodCardComponent;
  let fixture: ComponentFixture<MethodCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
