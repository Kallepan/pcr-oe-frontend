import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SamplesViewComponent } from './samples-view/samples-view.component';
import { SamplesRoutingModule } from './samples-routing.module';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SampleTableComponent } from './sample-table/sample-table.component';
import { SearchComponent } from './search/search.component';
import { EditSampleAnalysisDialogComponent } from './edit-sample-analysis-dialog/edit-sample-analysis-dialog.component';
import { EditSampleCommentDialogComponent } from './edit-sample-comment-dialog/edit-sample-comment-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@NgModule({
  declarations: [
    SamplesViewComponent,
    EditSampleAnalysisDialogComponent,
    SampleTableComponent,
    SearchComponent,
    EditSampleCommentDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    SamplesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DATA, useValue: {
        sample: {
          id: 1,
          name: 'test',
          comment: 'test',
          analysis: 'test',
          created_at: 'test',
        }
      }
    },
  ]
})
export class SamplesModule { }
