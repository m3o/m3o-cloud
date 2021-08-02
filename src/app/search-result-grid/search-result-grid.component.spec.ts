import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultGridComponent } from './search-result-grid.component';

describe('SearchResultGridComponent', () => {
  let component: SearchResultGridComponent;
  let fixture: ComponentFixture<SearchResultGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchResultGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
