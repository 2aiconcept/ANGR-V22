import { TestBed } from '@angular/core/testing';
import { EntreprisesService } from './entreprises-service';

describe('EntreprisesService', () => {
  let service: EntreprisesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntreprisesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
