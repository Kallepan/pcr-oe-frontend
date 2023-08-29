import { TestBed } from '@angular/core/testing';

import { SamplesAPIService } from './samples-api.service';
import { AppModule } from '../app.module';

describe('SamplesAPIService', () => {
  let service: SamplesAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    service = TestBed.inject(SamplesAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
