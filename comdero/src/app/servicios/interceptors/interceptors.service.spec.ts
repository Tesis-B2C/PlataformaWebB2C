import { TestBed } from '@angular/core/testing';

import { InterceptorsService } from './interceptors.service';

describe('InterceptorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterceptorsService = TestBed.get(InterceptorsService);
    expect(service).toBeTruthy();
  });
});
