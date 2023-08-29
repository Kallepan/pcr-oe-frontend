import { TestBed } from '@angular/core/testing';

import { SamplesAnalysesAPIService } from './samples-analyses-api.service';
import { AppModule } from '../app.module';

describe('SamplesAnalysesAPIService', () => {
  let service: SamplesAnalysesAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    service = TestBed.inject(SamplesAnalysesAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
