import { TestBed } from '@angular/core/testing';

import { RegistryService } from './registry.service';

describe('RegistryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistryService = TestBed.get(RegistryService);
    expect(service).toBeTruthy();
  });
});
