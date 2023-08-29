import { TestBed } from '@angular/core/testing';

import { SamplesAnalysisDataService } from './samples-analysis-data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SampleAnalysisModule } from './sample-analysis.module';

describe('SamplesAnalysisDataService', () => {
  let service: SamplesAnalysisDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SampleAnalysisModule
      ]
    });
    service = TestBed.inject(SamplesAnalysisDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
