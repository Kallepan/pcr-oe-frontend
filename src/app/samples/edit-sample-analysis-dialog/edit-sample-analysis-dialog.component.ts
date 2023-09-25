import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAPIService } from 'src/app/services/samples-api.service';
import { Panel, SamplePanel } from '../samples';
import { BehaviorSubject, Observable, Subscription, catchError, map, tap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-edit-sample-analysis-dialog',
  templateUrl: './edit-sample-analysis-dialog.component.html',
  styleUrls: ['./edit-sample-analysis-dialog.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter',
        [
          style({ opacity: 0 }),
          animate('200ms ease-out', style({ opacity: 1 }))
        ]),
      transition(':leave',
        [
          style({ opacity: 1 }),
          animate('200ms ease-in', style({ opacity: 0 }))
        ]),
    ])
  ]
})
export class EditSampleAnalysisDialogComponent implements OnInit, OnDestroy {
  filter: BehaviorSubject<string> = new BehaviorSubject<string>('');
  filter$: Observable<string> = this.filter.asObservable().pipe(
    map(filter => filter.trim().toLowerCase()),
    tap(filter => {
      const panels = this._panels$.value.map(p => { p.hidden = !p.panel_id.toLowerCase().includes(filter); return p; });
      this._panels$.next(panels);
    })
  );
  private _filterSubscription: Subscription | undefined;

  private _panels$ = new BehaviorSubject<Panel[]>([]);
  panels$: Observable<Panel[]> = this._panels$.asObservable();

  private _activePanelsForSample = new BehaviorSubject<Panel[]>([]);
  activePanelsForSample$: Observable<Panel[]> = this._activePanelsForSample.asObservable();

  constructor(
    private dialogRef: MatDialogRef<EditSampleAnalysisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _samplesAPIService: SamplesAPIService,
    private _messageService: MessageService,
  ) { }

  applyFilter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.filter.next(filter);
  }

  ngOnDestroy(): void {
    this._filterSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this._filterSubscription = this.filter$.subscribe();
    // This is to make sure the user cant select associated analyses.
    this._samplesAPIService.getPanels().subscribe({
      next: (resp) => {
        const panels: Panel[] = resp.body?.data || [];
        this._panels$.next(panels.map(p => { p.hidden = false; return p; }));

        if (!this.data?.sample) {
          return;
        }

        // Get the analyses associated with the sample
        this._samplesAPIService.getPanelsBySampleId(this.data.sample.sample_id).pipe(
          catchError((err) => {
            // API returns 404 if no analyses are associated with the sample. Ignore this error.
            return [];
          }),
        ).subscribe({
          next: (resp) => {
            const samplePanels: SamplePanel[] = resp.body?.data || [];
            const panelsFromSample: Panel[] = samplePanels.map(sp => sp.panel);
            this._activePanelsForSample.next(panelsFromSample);
          }
        });
      }
    });
  }

  checkIfSampleContains(analysis: Panel): boolean {
    return this._activePanelsForSample.value.find(a => a.panel_id === analysis.panel_id) !== undefined;
  }

  toggleAnalysis(analysis: Panel) {
    if (!this.data?.sample) {
      if (this._activePanelsForSample.value.find(a => a.panel_id === analysis.panel_id) !== undefined) {
        this._activePanelsForSample.next(this._activePanelsForSample.value.filter(a => a.panel_id !== analysis.panel_id));
      } else {
        this._activePanelsForSample.next([...this._activePanelsForSample.value, analysis]);
      }
      return;
    };

    if (this.checkIfSampleContains(analysis)) {
      this._samplesAPIService.removePanelFromSample(this.data.sample.sample_id, analysis.panel_id).subscribe({
        next: (resp) => {
          this._activePanelsForSample.next(this._activePanelsForSample.value.filter(a => a.panel_id !== analysis.panel_id));
          this._messageService.goodMessage(`Analyse ${analysis.panel_id} wurde erfolgreich entfernt.`);
        }
      });
    } else {
      this._samplesAPIService.addPanelToSample(this.data.sample.sample_id, analysis.panel_id).subscribe({
        next: (resp) => {
          this._activePanelsForSample.next([...this._activePanelsForSample.value, analysis]);
          this._messageService.goodMessage(`Analyse ${analysis.panel_id} wurde erfolgreich hinzugefügt.`)
        }
      });
    }
  }

  onCloseClick() {
    this.dialogRef.close(this._activePanelsForSample.value);
  }
}
