import { TestBed } from '@angular/core/testing';

import { ChampionRequestService } from './champion-request-service';

describe('ChampionRequestService', () => {
  let service: ChampionRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChampionRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
