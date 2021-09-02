import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadModalComponent } from './download-modal.component';

describe('DownloadModalComponent', () => {
  let component: DownloadModalComponent;
  let fixture: ComponentFixture<DownloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
