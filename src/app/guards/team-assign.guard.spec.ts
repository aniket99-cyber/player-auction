import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { teamAssignGuard } from './team-assign.guard';

describe('teamAssignGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => teamAssignGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
