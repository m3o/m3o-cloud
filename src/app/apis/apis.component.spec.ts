import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApisComponent } from './apis.component';

describe('SettingsComponent', () => {
  let component: ApisComponent;
  let fixture: ComponentFixture<ApisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApisComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
