import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Control, SamplePanel } from 'src/app/samples/samples';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAnalysisDataService } from '../samples-analysis-data.service';
import { ERRORS } from 'src/app/config/errors';

const MAX_ACTIVE_SAMPLES = 12;

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit, OnDestroy {
  numberOfActiveSamples = 0;
  filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filter$: Observable<string> = this.filter.asObservable().pipe(
    map(filter => filter.trim().toLowerCase()),
    tap(filter => this._samplesAnalysisDataService.filterInactiveSamplesAnalyses(filter))
  );

  inactiveSamplesAnalyses$: Observable<SamplePanel[]> = this._samplesAnalysisDataService.inactiveSamplesAnalyses$;

  constructor(
    private _messageService: MessageService,
    private _samplesAnalysisDataService: SamplesAnalysisDataService
  ) { }
  
  ngOnInit(): void {
    this._samplesAnalysisDataService.onInit();
    this._samplesAnalysisDataService.refreshSamplesAnalysesInterval(5000);
  }

  private _isMoreThanAllowedActiveElements(): boolean {
    // Returns true if the max number of active elements has been reached
    const numberofActiveElements = this._samplesAnalysisDataService.getNumberofActiveElements();
    if (numberofActiveElements >= MAX_ACTIVE_SAMPLES) {
      this._messageService.simpleWarnMessage(ERRORS.ERROR_TO_MANY_SAMPLES);
      return false;
    }
    
    return true;
  }

  addControl(controlString: string): void {
    if(!this._isMoreThanAllowedActiveElements()) return;

    this._samplesAnalysisDataService.addControl(controlString);
  }

  activateSampleAnalysis(sampleAnalysis: SamplePanel): void {
    if(!this._isMoreThanAllowedActiveElements()) return;

    this._samplesAnalysisDataService.addSampleAnalysis(sampleAnalysis);
  }

  removeObjectFromActiveList(sampleAnalysis: (SamplePanel|Control)): void {
    this._samplesAnalysisDataService.removeObjectFromActiveList(sampleAnalysis);
  }

  isLoading(): boolean {
    return this._samplesAnalysisDataService.loading;
  }

  ngOnDestroy(): void {
    // Destroy interval subscription when 'module' is destroyed
    // I do not know if this is the correct way to do this
    // But it works
    this._samplesAnalysisDataService.intervalSubscription?.unsubscribe();
  }
}
