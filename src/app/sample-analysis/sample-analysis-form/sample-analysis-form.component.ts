import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Control, SamplePanel, isControl } from 'src/app/samples/samples';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAnalysisDataService } from '../samples-analysis-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERRORS } from 'src/app/config/errors';
import { SamplesAnalysesAPIService } from 'src/app/services/samples-analyses-api.service';
import { CONSTANTS } from 'src/app/config/constants';
import moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

const devices = CONSTANTS.DEVICES;
const runs = CONSTANTS.RUNS;

export type ExportData = {
  device: string,
  run: string,
  date: string,
  elements: (Control | SamplePanel)[],
};

@Component({
  selector: 'app-sample-analysis-form',
  templateUrl: './sample-analysis-form.component.html',
  styleUrls: ['./sample-analysis-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CONSTANTS.DATE_FORMATS }
  ]
})
export class SampleAnalysisFormComponent implements OnDestroy {
  devices = devices;
  runs = runs;
  samplesAnalysisFormGroup: FormGroup;

  todayDate = moment();

  activeElements$: Observable<(SamplePanel | Control)[]> = this._samplesAnalysisDataService.activeElements$;

  private _reset() {
    this._samplesAnalysisDataService.reset();
    this.samplesAnalysisFormGroup.reset();

    // Reset date to today
    this.samplesAnalysisFormGroup.patchValue({
      runDate: this.todayDate,
    });
  }

  deactivateSampleAnalysis(sampleAnalysis: SamplePanel): void {
    this._samplesAnalysisDataService.removeObjectFromActiveList(sampleAnalysis);
  }

  onSubmit() {
    if (this.samplesAnalysisFormGroup.invalid) {
      this._messageService.simpleWarnMessage(ERRORS.INVALID_INPUT);
      return;
    };
    const rawExportData = this._samplesAnalysisDataService.getExportData();
    // Check if rawExportData is empty
    if (rawExportData.length === 0) {
      this._messageService.simpleWarnMessage(ERRORS.samplesAnalysisErrors.SAMPLE_ANALYSIS_NO_SAMPLE_SELECTED);
      return;
    }

    const elements: any[] = [];
    rawExportData.forEach(element => {
      if (isControl(element)) {
        elements.push({
          control_id: element.control_id.toString(),
          description: element.description,
        });
      } else {
        elements.push({
          sample_id: element.sample.sample_id.toString(),
          panel_id: element.panel.panel_id.toString(),
        });
      }
    });
    const date = moment(this.samplesAnalysisFormGroup.value.date).format('YYYY-MM-DD');

    const exportData: ExportData = {
      device: this.samplesAnalysisFormGroup.value.device,
      run: this.samplesAnalysisFormGroup.value.run,
      date: date,
      elements: elements,
    };

    this._samplesAnalysesAPIService.createRun(exportData).subscribe({
      next: (response) => {
        const blob: Blob = response.body;

        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `${exportData.device}_${exportData.run}-${Date.now()}.xlsm`;
        a.click();
        window.URL.revokeObjectURL(a.href);

        // Reset Form
        this._reset();

        // Print Labels
        this._printLabels(elements);
      }, error: (error) => {
        error.error.text().then((text: string) => {
          const err_json = JSON.parse(text);
          this._messageService.simpleWarnMessage(err_json.message);
        });
      }
    })
  }

  private _printLabels(elements: any[]) {
    // Uncomment this to disable printing
    // this._messageService.goodMessage("Drucken ist ausgeschaltet.");
    // return;

    const filteredElements: any[] = elements.filter((element) => element.sample_id || element.panel_id).map(
      (element) => {
        const data = {
          sample_id: element.sample_id,
          panel_id: element.panel_id,
        };
        return data;
      });

    this._samplesAnalysesAPIService.printLabels(filteredElements).subscribe({
      next: () => {
        // Do nothing
      }
    });
  }

  constructor(
    private _messageService: MessageService,
    private _samplesAnalysisDataService: SamplesAnalysisDataService,
    private _samplesAnalysesAPIService: SamplesAnalysesAPIService,
  ) {
    const fb = new FormBuilder();
    this.samplesAnalysisFormGroup = fb.group({
      device: ['', [Validators.required]],
      run: ['', [Validators.required]],
      date: [this.todayDate, [Validators.required]],
    })
  }

  ngOnDestroy(): void {
    this._samplesAnalysisDataService.reset();
  }
}
