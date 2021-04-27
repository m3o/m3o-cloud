import { TestBed } from '@angular/core/testing';

import { ExploreService } from './explore.service';

describe('ExploreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExploreService = TestBed.get(ExploreService);
    expect(service).toBeTruthy();
  });
});
