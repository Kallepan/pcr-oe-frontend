import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Sample } from '../samples';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

const COLUMNS = [
  {key: "idx", label: "Nr.", },
  {key: "sample_id", label: "Tagesnummer/Name", },
  {key: "panels", label: "Panels/Analysen", },
  {key: "birthdate", label: "Geburtsdatum", },
  {key: "sputalysed", label: "Sputasol", },
  {key: "material", label: "Material", },
  {key: "comment", label: "Kommentar", },
  {key: "actions", label: "Aktionen", },
]

export type EditSampleEmitter = {
  sample: Sample;
  editAnalysis?: boolean;
  editComment?: boolean;
}

@Component({
  selector: 'app-sample-table',
  templateUrl: './sample-table.component.html',
  styleUrls: ['./sample-table.component.scss']
})
export class SampleTableComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  dataSource: MatTableDataSource<Sample> = new MatTableDataSource();
  columnsSchema = COLUMNS;
  displayedColumns = COLUMNS.map(c => c.key);

  // Filter
  private _filter$ = new BehaviorSubject<string>("");
  private filterSubscription: Subscription | undefined;

  // Pagination 
  pageSizeOptions = [10, 25, 50, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Inputs and Outputs
  @Input() samples: Sample[];
  @Output() onDeleteSample = new EventEmitter<Sample>();
  @Output() onEditSample = new EventEmitter<EditSampleEmitter>();
  @Output() onAddSample = new EventEmitter<Sample>();

  
  // Actions on table
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    const formattedFilter = filterValue.trim().toLowerCase();

    this._filter$.next(formattedFilter);
  }

  // Actions on samples
  onDeleteSampleClick(sample: Sample) {
    if(!confirm(`Soll die Probe ${sample.sample_id} wirklich gelöscht werden?`)) {
      return;
    }

    this.onDeleteSample.emit(sample);
  }
  onEditSampleAnalysisClick(sample: Sample) {
    this.onEditSample.emit({sample: sample, editAnalysis: true});
  }
  onEditSampleCommentClick(sample: Sample) {
    this.onEditSample.emit({sample: sample, editComment: true});
  }
  
  toggleSputasol(sample: Sample) {
    sample.sputalysed = !sample.sputalysed;
    this.onEditSample.emit({sample: sample});
  }
  

  constructor() { }

  ngOnInit(): void {
    this.filterSubscription = this._filter$.subscribe(filter => {
      this.dataSource.filter = filter;
    });
  }

  ngOnChanges() {
    this.dataSource.data = this.samples;
    const filter = this._filter$.getValue();
    this.dataSource.filter = filter;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.filterSubscription?.unsubscribe();
  }
}
