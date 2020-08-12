import { TestBed, async, inject } from '@angular/core/testing';

import { ReloadGuard } from './reload.guard';

describe('ReloadGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReloadGuard]
    });
  });

  it('should ...', inject([ReloadGuard], (guard: ReloadGuard) => {
    expect(guard).toBeTruthy();
  }));
});
