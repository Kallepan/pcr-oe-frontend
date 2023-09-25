import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
import { Subject, catchError, map } from 'rxjs';
import { CONSTANTS } from 'src/app/config/constants';
import { ERRORS } from 'src/app/config/errors';
import { SamplePanel } from 'src/app/samples/samples';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAnalysesAPIService } from 'src/app/services/samples-analyses-api.service';

const devices = CONSTANTS.DEVICES;
const runs = CONSTANTS.RUNS;

@Component({
  selector: 'app-query-run',
  templateUrl: './query-run.component.html',
  styleUrls: ['./query-run.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CONSTANTS.DATE_FORMATS }
  ]
})
export class QueryRunComponent {
  devices = devices;
  runs = runs;

  private _samplePanels$ = new Subject<SamplePanel[]>();
  samplePanels$ = this._samplePanels$.asObservable().pipe(
    map((samplePanels) => {
      samplePanels.forEach((samplePanel) => {
        samplePanel.sample.displaySampleId = samplePanel.sample.sample_id.slice(0, 4) + ' ' + samplePanel.sample.sample_id.slice(4, 10) + ' ' + samplePanel.sample.sample_id.slice(10, 12)
      });

      return samplePanels;
    }),
  );

  queryRunFormGroup: FormGroup;

  private _reset() {
    this._samplePanels$.next([]);
  }

  printLabels(samplePanels: SamplePanel[]) {
    // Function to print the labels of  currently displayed samples  
    
    const printData = samplePanels.map((samplePanel) => {
      const data = {
        sample_id: samplePanel.sample.sample_id,
        panel_id : samplePanel.panel.panel_id,
      }
      return data;
    });

    this._samplesAnalysisAPISerice.printLabels(printData).subscribe({
      next: () => {
        // Do nothing
      }
    });
  }

  onSubmit() {
    if (this.queryRunFormGroup.invalid) {
      return;
    }

    this._reset();

    const device = this.queryRunFormGroup.get('device')?.value;
    const run = this.queryRunFormGroup.get('run')?.value;
    const runDate = this.queryRunFormGroup.get('runDate')?.value;

    // Format run date to YYYY-MM-DD
    const runDateFormatted = moment(runDate).format('YYYY-MM-DD');

    this._samplesAnalysisAPISerice.getSamplesAnalysesForRun(runDateFormatted, run, device).pipe(
      catchError((error) => {
        if (error.status === 404) {
          this._messageService.goodMessage(ERRORS.samplesAnalysisErrors.NO_RUN_FOUND);
          return [];
        }

        throw error;
      }),
    ).subscribe({
      next: (response) => {
        const samplePanels: SamplePanel[] = response.body?.data;
        
        this._samplePanels$.next(samplePanels);
      },
    })
  }

  resetSamplePanel(samplePanel: SamplePanel) {
    samplePanel.sample.displaySampleId = samplePanel.sample.sample_id.slice(0, 4) + ' ' + samplePanel.sample.sample_id.slice(4, 8) + ' ' + samplePanel.sample.sample_id.slice(8, 12)
    // Check if samplePanel is already reset
    if (!samplePanel.run_date || !samplePanel.run || !samplePanel.device) {
      this._messageService.simpleWarnMessage(`Die Probe ${samplePanel.sample.displaySampleId} mit der Analyse ${samplePanel.panel.display_name} ist noch nicht gelaufen.`);
      return;
    }

    // Resets the status of the sample and panel as if it never ran before
    if (!confirm(`Soll die Probe ${samplePanel.sample.displaySampleId} mit der Analyse ${samplePanel.panel.display_name} wirklich zurückgesetzt werden? Dies kann nicht rückgängig gemacht werden.`)) {
      return;
    }

    // Post to reset endpoint
    this._samplesAnalysisAPISerice.resetSamplePanel(samplePanel.sample.sample_id, samplePanel.panel.panel_id).subscribe({
      next: (resp) => {
        this._messageService.goodMessage(`Die Probe ${samplePanel.sample.displaySampleId} mit der Analyse ${samplePanel.panel.display_name} wurde erfolgreich zurückgesetzt.`);
        this.onSubmit();
      }
    });
  }

  constructor(
    private _samplesAnalysisAPISerice: SamplesAnalysesAPIService,
    private _messageService: MessageService,
  ) { 
    const fb = new FormBuilder();

    this.queryRunFormGroup = fb.group({
      device: ['', [Validators.required]],  
      run: ['', [Validators.required]],
      runDate: moment(),
    });
  }
}
