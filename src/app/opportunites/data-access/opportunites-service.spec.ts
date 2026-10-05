import { TestBed } from '@angular/core/testing';
import { OpportunitesService } from './opportunites-service';

describe('OpportunitesService', () => {
  let service: OpportunitesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpportunitesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
