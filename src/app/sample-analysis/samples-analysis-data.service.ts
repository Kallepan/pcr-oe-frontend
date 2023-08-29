import { Injectable, OnDestroy } from '@angular/core';
import { Control, SamplePanel, isControl } from '../samples/samples';
import { BehaviorSubject, Subscription, catchError, interval, switchMap, tap } from 'rxjs';
import { SamplesAnalysesAPIService } from '../services/samples-analyses-api.service';
import { MessageService } from '../services/message.service';
import { ERRORS } from '../config/errors';

@Injectable({
  providedIn: 'any',
})
export class SamplesAnalysisDataService {
  loading = true;

  intervalSubscription: Subscription | undefined;

  private _inactiveSamplesAnalyses = new BehaviorSubject<SamplePanel[]>([]);
  inactiveSamplesAnalyses$ = this._inactiveSamplesAnalyses.asObservable();

  private _activeElements = new BehaviorSubject<(SamplePanel | Control)[]>([]);
  activeElements$ = this._activeElements.asObservable().pipe(
    tap(activeElements => {
      const newActiveElements = activeElements.filter(activeElement => !isControl(activeElement)) as SamplePanel[];

      // Automatically filter out active samples
      const inactiveSamplesAnalyses = this._inactiveSamplesAnalyses.getValue().filter(inactiveSampleAnalysis => {
        return !newActiveElements.some(activeSampleAnalysis => {
          return activeSampleAnalysis.sample.sample_id === inactiveSampleAnalysis.sample.sample_id && activeSampleAnalysis.panel.panel_id === inactiveSampleAnalysis.panel.panel_id;
        });
      });
      this._inactiveSamplesAnalyses.next(inactiveSamplesAnalyses);
    }),
  );

  dispose() {
    this.intervalSubscription?.unsubscribe();
  }

  reset() {
    this._activeElements.next([]);
    this.loading = true;
    this.onInit();
  }

  getExportData() {
    // Get data for export to backend
    return this._activeElements.getValue()
  }
  getNumberofActiveElements(): number {
    return this._activeElements.getValue().length;
  }

  onInit() {
    this._samplesAnalysisAPIService.getSamplesAnalyses().pipe(
      catchError((error) => {
        if (error.status === 404) {
          this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_NO_SAMPLES);
        } 
        this.loading = false;
        return [];
      }),
    ).subscribe({
      next: (response) => {
        const samplesAnalyses: SamplePanel[] | null = response.body;
        this.loading = false;
        if (!samplesAnalyses) { this._inactiveSamplesAnalyses.next([]); return; }

        samplesAnalyses.map(sampleAnalysis => {
          // Initial state
          sampleAnalysis.visible = true;
          sampleAnalysis.sample.displaySampleId = sampleAnalysis.sample.sample_id.slice(0, 4) + " " + sampleAnalysis.sample.sample_id.slice(4, 10) + " " + sampleAnalysis.sample.sample_id.slice(10, 12);;
        });
        this._inactiveSamplesAnalyses.next(samplesAnalyses);
      },
    });
  }

  refreshSamplesAnalysesInterval(intervalMs: number) {
    this.intervalSubscription = interval(intervalMs).pipe(
      switchMap(() => this._samplesAnalysisAPIService.getSamplesAnalyses())
    ).subscribe({
      next: (response) => {
        const samplesAnalyses: SamplePanel[] | null = response.body;
        if (!samplesAnalyses) return;

        const activeElements = this._activeElements.getValue().filter(activeElement => !isControl(activeElement)) as SamplePanel[];
        // Filter out active samples
        const filteredSamplesAnalyses = samplesAnalyses.filter(sampleAnalysis => {
          return !activeElements.some(activeSampleAnalysis => {
            return activeSampleAnalysis.sample.sample_id === sampleAnalysis.sample.sample_id && activeSampleAnalysis.panel.panel_id === sampleAnalysis.panel.panel_id;
          });
        });

        // Transfer state attribute from the old samples to the new samples
        const oldSamples = this._inactiveSamplesAnalyses.getValue();
        const statefulSamplesAnalyses = filteredSamplesAnalyses.map(sampleAnalysis => {
          const oldSample = oldSamples.find(oldSample => oldSample.sample.sample_id === sampleAnalysis.sample.sample_id && oldSample.panel.panel_id === sampleAnalysis.panel.panel_id);
          if (oldSample) {
            sampleAnalysis.visible = oldSample.visible;
          } else {
            sampleAnalysis.visible = true;
          }

          // Update obligatory display values
          sampleAnalysis.sample.displaySampleId = sampleAnalysis.sample.sample_id.slice(0, 4) + " " + sampleAnalysis.sample.sample_id.slice(4, 10) + " " + sampleAnalysis.sample.sample_id.slice(10, 12);

          return sampleAnalysis;
        });
        this._inactiveSamplesAnalyses.next(statefulSamplesAnalyses);
      },
    });
  }

  removeObjectFromActiveList(elementToRemove: (SamplePanel | Control)): void {
    // If control, remove all controls with the same control_id
    if (isControl(elementToRemove)) {
      const activeElements = this._activeElements.getValue();

      // Find by id and remove
      const newActiveSamplesAnalyses = activeElements.filter(activeSampleAnalysis => {
        if (!isControl(activeSampleAnalysis)) {
          return true;
        }
        return elementToRemove.control_id !== activeSampleAnalysis.control_id;
      });

      this._activeElements.next(newActiveSamplesAnalyses);
      return;
    }

    // If sample analysis, remove only the sample analysis
    const activeElements = this._activeElements.getValue();
    const inactiveSamplesAnalyses = this._inactiveSamplesAnalyses.getValue();
    // Check if sample analysis is already inactive
    if (inactiveSamplesAnalyses.some(inactiveSampleAnalysis => inactiveSampleAnalysis.sample.sample_id === elementToRemove.sample.sample_id && inactiveSampleAnalysis.panel.panel_id === elementToRemove.panel.panel_id)) {
      this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_ALREADY_INACTIVE);
      return;
    }

    // Check if sample analysis is present in active
    if (!activeElements.some(activeSampleAnalysis => {
      if (isControl(activeSampleAnalysis)) {
        return false;
      }
      return activeSampleAnalysis.sample.sample_id === elementToRemove.sample.sample_id && activeSampleAnalysis.panel.panel_id === elementToRemove.panel.panel_id
    })
    ) {
      this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_NOT_ACTIVE);
      return;
    }

    // Remove sample analysis from active
    const newActiveElements = activeElements.filter(activeElement => {
      if (isControl(activeElement)) {
        return true;
      }
      return activeElement.sample.sample_id !== elementToRemove.sample.sample_id || activeElement.panel.panel_id !== elementToRemove.panel.panel_id;
    });
    this._activeElements.next(newActiveElements);

    // Add sample analysis to inactive
    this._inactiveSamplesAnalyses.next([...inactiveSamplesAnalyses, elementToRemove].sort((a, b) => a.created_at > b.created_at ? -1 : 1));
  }

  addControl(controlString: string): void {
    const activeControls = this._activeElements.getValue().filter(element => isControl(element)) as Control[];
    const lastIndex = activeControls.length;
    const control: Control = {
      control_id: lastIndex,
      description: controlString,
    }
    this._activeElements.next([...this._activeElements.getValue(), control]);
  }
  addSampleAnalysis(sampleAnalysis: SamplePanel): void {
    const activeElements = this._activeElements.getValue();
    const inactiveSamplesAnalyses = this._inactiveSamplesAnalyses.getValue();

    // Check if sample analysis is already active
    if (activeElements.some(activeSampleAnalysis => {
      if (isControl(activeSampleAnalysis)) {
        return false;
      }
      return activeSampleAnalysis.sample.sample_id === sampleAnalysis.sample.sample_id && activeSampleAnalysis.panel.panel_id === sampleAnalysis.panel.panel_id
    })
    ) {
      this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_ALREADY_ACTIVE);
      return;
    }

    // Check if sample analysis is present in inactive
    if (!inactiveSamplesAnalyses.some(inactiveSampleAnalysis => inactiveSampleAnalysis.sample.sample_id === sampleAnalysis.sample.sample_id && inactiveSampleAnalysis.panel.panel_id === sampleAnalysis.panel.panel_id)) {
      this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_NOT_FOUND);
      return;
    }

    // Add sample analysis to active and reset visibility
    sampleAnalysis.visible = true;
    this._activeElements.next([...activeElements, sampleAnalysis]);
  }

  filterInactiveSamplesAnalyses(filter: string): void {
    const samplesAnalyses = this._inactiveSamplesAnalyses.getValue();

    // Empty filter -> reset visibility
    if (filter === "") {
      this._inactiveSamplesAnalyses.next(samplesAnalyses.map(sampleAnalysis => { sampleAnalysis.visible = true; return sampleAnalysis; }));
      return;
    }

    const filteredSamplesAnalyses = samplesAnalyses.map(sampleAnalysis => {
      const targetValues: string[] = [sampleAnalysis.sample.sample_id, sampleAnalysis.panel.panel_id];
      // Values to be filtered by
      const values = targetValues.map(value => value.toLowerCase());

      // Filter
      sampleAnalysis.visible = values.some(value => value.includes(filter.toLowerCase()));

      return sampleAnalysis;
    });
    this._inactiveSamplesAnalyses.next(filteredSamplesAnalyses);
  }

  constructor(
    private _samplesAnalysisAPIService: SamplesAnalysesAPIService,
    private _messageService: MessageService
  ) { }
}
