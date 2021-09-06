import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateButtonComponent } from './generate-button.component';

describe('GenerateButtonComponent', () => {
  let component: GenerateButtonComponent;
  let fixture: ComponentFixture<GenerateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
