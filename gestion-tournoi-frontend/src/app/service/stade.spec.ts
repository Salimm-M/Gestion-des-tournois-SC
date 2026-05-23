import { TestBed } from '@angular/core/testing';

import { Stade } from './stade';

describe('Stade', () => {
  let service: Stade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Stade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
