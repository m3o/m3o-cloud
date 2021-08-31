import { TestBed } from '@angular/core/testing';

import { SingleApiService } from './single-api.service';

describe('SingleApiService', () => {
  let service: SingleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
