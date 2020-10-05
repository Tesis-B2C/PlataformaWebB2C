import { TestBed } from '@angular/core/testing';

import { Interceptors2Service } from './interceptors2.service';

describe('Interceptors2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Interceptors2Service = TestBed.get(Interceptors2Service);
    expect(service).toBeTruthy();
  });
});
