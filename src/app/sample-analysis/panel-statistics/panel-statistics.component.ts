import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, Subscription, catchError, forkJoin, interval, map, tap } from 'rxjs';
import { ERRORS } from 'src/app/config/errors';
import { MessageService } from 'src/app/services/message.service';
import { SamplesAnalysesAPIService } from 'src/app/services/samples-analyses-api.service';

export type Statistic = {
  panel_id: string,
  count: number,
}

export const COLOR_ENCODING: any = {
  0: "#2cba00",
  2: "#a3ff00",
  5: "#fff400",
  7: "#ff8c00",
  10: "#ff0000",
}

type Column = {
  key: string,
  color: string,
  label: string,
  value: string
}

@Component({
  selector: 'app-panel-statistics',
  templateUrl: './panel-statistics.component.html',
  styleUrls: ['./panel-statistics.component.scss']
})
export class PanelStatisticsComponent implements OnInit, OnDestroy {
  private _intervalSubscription: Subscription | undefined;

  columnData: Column[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Statistic>([]);

  public getColor(count: number): string {
    /* Return the largest value which is smaller than the count */
    const keys = Object.keys(COLOR_ENCODING).map((key) => parseInt(key));
    const sortedKeys = keys.sort((a, b) => a - b);
    const color = sortedKeys.filter((key) => key <= count).pop();

    if (color === undefined) {
      return "#000000";
    }

    return COLOR_ENCODING[color];
  }


  private _refreshStats() {
    this._samplesAnalysesAPIService.getStatistics().subscribe({
      next: (response) => {
        const stats: Statistic[] | null = response.body?.data;
        if (stats === null) {
          this._messageService.simpleWarnMessage(ERRORS.ERROR_API_GET_STATISTICS);
          return;
        }
        const data: any = {};
        stats.forEach((stat) => {
          data[stat.panel_id] = stat.count;
        });

        this.displayedColumns = Object.keys(data).sort()

        this.columnData = Object.keys(data).sort().map(key => {
          return {
            key: key,
            color: this.getColor(data[key]),
            label: key,
            value: data[key]
          }
        })
        this.dataSource.data = [data];
      }, error: (error) => {
        this._messageService.simpleWarnMessage(ERRORS.ERROR_API_GET_STATISTICS);
      }
    });
  }

  constructor(
    private _samplesAnalysesAPIService: SamplesAnalysesAPIService,
    private _messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this._refreshStats();
    this._intervalSubscription =  interval(20000).pipe(
      tap(() => this._refreshStats())
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._intervalSubscription?.unsubscribe();
  }
}
