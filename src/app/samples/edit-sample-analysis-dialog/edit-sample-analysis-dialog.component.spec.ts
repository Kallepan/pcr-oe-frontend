import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSampleAnalysisDialogComponent } from './edit-sample-analysis-dialog.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

describe('EditSampleDialogComponent', () => {
  let component: EditSampleAnalysisDialogComponent;
  let fixture: ComponentFixture<EditSampleAnalysisDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, SamplesModule],
      declarations: [ EditSampleAnalysisDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSampleAnalysisDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
