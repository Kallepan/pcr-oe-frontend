import { Component } from '@angular/core';
import { SamplesAnalysisDataService } from '../../samples-analysis-data.service';
import { Observable, tap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Control, SamplePanel } from 'src/app/samples/samples';


const COLUMNS = [
  { key: "idx", label: "Nr.", },
  { key: "sample", label: "Tagesnummer/Name", },
  { key: "panel", label: "Analyse", },
  { key: "ready_mix", label: "Ready Mix", },
  { key: "actions", label: "Aktionen", },
]

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent {
  dataSource: MatTableDataSource<SamplePanel|Control> = new MatTableDataSource();
  columnsSchema = COLUMNS;
  displayedColumns = COLUMNS.map(c => c.key);
  lastIndex: number = 1; // TODO: implement asking the database for the last position assigned to the last sample of the last run in a day

  activeElements$: Observable<(SamplePanel|Control)[]> = this._samplesAnalysesDataService.activeElements$.pipe(
    tap((activeElements) => {
      this.dataSource.data = activeElements;
    }),
  );
  
  removeElementFromActiveList(sampleAnalysis: (SamplePanel|Control)): void {
    this._samplesAnalysesDataService.removeObjectFromActiveList(sampleAnalysis);
  }

  constructor(private _samplesAnalysesDataService: SamplesAnalysisDataService) {  }
}
