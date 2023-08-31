import { Component, OnDestroy, OnInit } from '@angular/core';
import { SamplesAPIService } from 'src/app/services/samples-api.service';
import { Panel, Sample } from '../samples';
import { Subject, Subscription, interval, map } from 'rxjs';
import { MessageService } from 'src/app/services/message.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSampleAnalysisDialogComponent } from '../edit-sample-analysis-dialog/edit-sample-analysis-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SamplesAnalysesAPIService } from 'src/app/services/samples-analyses-api.service';
import { ERRORS } from 'src/app/config/errors';
import { EditSampleEmitter } from '../sample-table/sample-table.component';
import { EditSampleCommentDialogComponent } from '../edit-sample-comment-dialog/edit-sample-comment-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { default as _rollupMoment } from 'moment';
import * as _moment from 'moment';
import { CONSTANTS } from 'src/app/config/constants';

const moment = _rollupMoment || _moment;

const FormatDate = (rawDate: string) => {
  // Format created_at from sample to german locale 
  const date = new Date(rawDate);
  return date.toLocaleDateString('de-DE') + " " + date.toLocaleTimeString('de-DE');
}
@Component({
  selector: 'app-samples-view',
  templateUrl: './samples-view.component.html',
  styleUrls: ['./samples-view.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CONSTANTS.DATE_FORMATS }
  ]
})
export class SamplesViewComponent implements OnInit, OnDestroy {
  private _checkedAnalyses: Panel[] = [];
  private _samples$: Subject<Sample[]> = new Subject<Sample[]>();

  sampleForm: FormGroup;
  interval: any | undefined;

  intervalSubscription: Subscription | undefined;

  samples$ = this._samples$.asObservable().pipe(
    map((samples: Sample[] | null) => {
      if (!samples) {
        return [];
      }
      samples.forEach((sample: Sample) => {
        sample.displaySampleId = sample.sample_id.slice(0, 4) + " " + sample.sample_id.slice(4, 10) + " " + sample.sample_id.slice(10, 12);
        sample.created_at = FormatDate(sample.created_at);
      });

      return samples;
    })
  )

  constructor(
    private _samplesAPIService: SamplesAPIService,
    private _messageService: MessageService,
    private _samplesAnalysisAPIService: SamplesAnalysesAPIService,
    private _dialog: MatDialog,
  ) {
    const fb = new FormBuilder();
    this.sampleForm = fb.group({
      sample_id: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)],],
      full_name: ['', [Validators.required]],
      birthdate: [moment(), [Validators.required]],
      material: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern(/^[A-Z]{3,10}$/)]],
      comment: [''],
    });
  }

  private _refreshSamples() {
    this._samplesAPIService.getSamples().subscribe({
      next: (resp) => {
        const samples: Sample[] = resp.body;
        this._samples$.next(samples);
      }
    })
  }

  onPickAnalysisClick() {
    // Check if sample form is valid
    if (this.sampleForm.invalid) {
      this._messageService.simpleWarnMessage("Bitte alle Felder korrekt ausfüllen.");
      return;
    }

    // First create sample
    this._samplesAPIService.postSample(this.sampleForm.value).subscribe({
      next: (resp) => {
        // Now open the dialog to pick analyses
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.data = {
          sample: null,
          checkedAnalyses: this._checkedAnalyses
        };

        this._dialog.open(EditSampleAnalysisDialogComponent, dialogConfig).afterClosed().subscribe((choice) => {
          if (!choice) {
            return;
          }
          const checkedAnalyses: Panel[] = choice;

          checkedAnalyses.forEach((analysis: Panel) => {
            this._samplesAnalysisAPIService.postSamplesAnalyses(resp.body.sample_id, analysis.panel_id).subscribe({
              next: (resp) => {
                // Reset and patch form
                this._messageService.goodMessage("Analysen hinzugefügt.");
                this.sampleForm.reset();
                this.sampleForm.patchValue({
                  birthdate: moment()
                });
                this._refreshSamples();
              }
            });
          });
        });
      }
    })
  }

  onSampleEditClick(editSampleObj: EditSampleEmitter) {
    const sample = editSampleObj.sample;
    // No analysis edit requested
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      sample: sample
    };

    if (editSampleObj.editComment) {
      this._dialog.open(EditSampleCommentDialogComponent, dialogConfig).afterClosed().subscribe((choice: null | Sample) => {
        if (!choice) {
          return;
        }

        const sample: Sample = choice;
        this._samplesAPIService.putSample(sample).subscribe({
          next: (resp) => {
            this._messageService.goodMessage("Probe aktualisiert");
            this._refreshSamples();
          }
        });
      });
      return;
    }

    // Analysis edit requested
    if (editSampleObj.editAnalysis) {
      this._dialog.open(EditSampleAnalysisDialogComponent, dialogConfig).afterClosed().subscribe((choice: null | any) => {
        if (!choice) return;
      });
    }
    this._samplesAPIService.putSample(sample).subscribe({
      next: (resp) => {
        this._refreshSamples();
      }
    });
  }

  onDeleteSampleClick(sample_id: string) {
    this._samplesAPIService.deleteSample(sample_id).subscribe({
      next: (resp) => {
        this._messageService.goodMessage("Probe gelöscht");
        this._refreshSamples();
      }
    })
  }

  ngOnInit(): void {
    this._refreshSamples();

    // Refresh samples every 5 seconds
    this.intervalSubscription = this.interval = interval(30000).subscribe(() => {
      this._refreshSamples();
    });
  }

  ngOnDestroy(): void {
    this.intervalSubscription?.unsubscribe();
  }
}
