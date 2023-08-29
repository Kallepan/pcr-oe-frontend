import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainViewComponent } from './main-view/main-view.component';
import { SampleAnalysisRoutingModule } from './sample-analysis-routing.module';
import { SampleAnalysisFormComponent } from './sample-analysis-form/sample-analysis-form.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SamplesAnalysisDataService } from './samples-analysis-data.service';
import { TableViewComponent } from './sample-analysis-form/table-view/table-view.component';
import { DateFormatPipe } from '../pipes';
import { CreateControlComponent } from './create-control/create-control.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PanelStatisticsComponent } from './panel-statistics/panel-statistics.component';
import { QueryRunComponent } from './query-run/query-run.component';



@NgModule({
  declarations: [
    MainViewComponent,
    SampleAnalysisFormComponent,
    TableViewComponent,
    DateFormatPipe,
    CreateControlComponent,
    PanelStatisticsComponent,
    QueryRunComponent,
  ],
  imports: [
    CommonModule,
    SampleAnalysisRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    SamplesAnalysisDataService,
    {provide: MAT_DIALOG_DATA, useValue: {}},
  ]
})
export class SampleAnalysisModule { }
