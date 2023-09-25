import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAPIService } from 'src/app/services/samples-api.service';
import { Sample, SamplePanel } from '../samples';
import { Subject, catchError, map } from 'rxjs';
import { ERRORS } from 'src/app/config/errors';
import { SamplesAnalysesAPIService } from 'src/app/services/samples-analyses-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  sampleSearch: FormGroup;
  activeSamplePanels: SamplePanel[] = [];

  private _sampleSubject$ = new Subject<Sample>();
  sample$ = this._sampleSubject$.asObservable().pipe(
    map(sample => {
      sample.full_name = sample.full_name.split(",").reverse().join(" ");
      sample.birthdate = new Date(sample.birthdate).toLocaleDateString("de-DE");
      sample.displaySampleId = sample.sample_id.slice(0, 4) + ' ' + sample.sample_id.slice(4, 10) + ' ' + sample.sample_id.slice(10, 12)
      return sample;
    }),
  );

  constructor(
    private _messageService: MessageService,
    private _samplesAPIService: SamplesAPIService,
    private _samplesPanelsAPIService: SamplesAnalysesAPIService,
  ) {
    const fb = new FormBuilder();

    this.sampleSearch = fb.group({
      sample_id: ['', [Validators.pattern(/^[0-9]+$/), Validators.maxLength(12)]],
    });
  }

  private _reset() {
    this.activeSamplePanels = [];
  }

  onSubmit() {
    if (this.sampleSearch.invalid) {
      return;
    }

    this._reset();

    const sampleId = this.sampleSearch.value.sample_id;
    this._samplesAPIService.getSampleById(sampleId).subscribe({
      next: (resp) => {
        const samples = resp.body?.data || [];
        if (samples.length == 0) {
          this._messageService.simpleWarnMessage(`Keine Probe mit der Suche ${sampleId} gefunden.`);
          return;
        }
        if (samples.length > 1) this._messageService.goodMessage(`Es wurden ${samples.length} Proben gefunden. Nur die erste Probe wird angezeigt.`);
        
        const sample = samples[0];
        this._sampleSubject$.next(sample);

        const sampleID = sample.sample_id;

        this._samplesAPIService.getPanelsBySampleId(sampleID).pipe(
          catchError((err) => {
            if (err.status === 404) { this._messageService.simpleWarnMessage(`Keine Analyse für die Probe ${sampleID} gefunden.`); return []; }
            this._messageService.simpleWarnMessage(ERRORS.ERROR_API);
            return [];
          })
        ).subscribe({
          next: (resp) => {
            if (!resp.body) return;
            
            const samplePanels: SamplePanel[] = resp.body.data;
            this.activeSamplePanels = samplePanels;
          }
        });
      },
    });
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
    this._samplesPanelsAPIService.resetSamplePanel(samplePanel.sample.sample_id, samplePanel.panel.panel_id).subscribe({
      next: (resp) => {
        this._messageService.goodMessage(`Die Probe ${samplePanel.sample.displaySampleId} mit der Analyse ${samplePanel.panel.display_name} wurde erfolgreich zurückgesetzt.`);
        this.onSubmit();
      }
    });
  }
}
