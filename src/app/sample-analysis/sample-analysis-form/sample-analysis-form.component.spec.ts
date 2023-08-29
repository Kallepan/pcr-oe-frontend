import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAnalysisFormComponent } from './sample-analysis-form.component';
import { AppModule } from 'src/app/app.module';
import { SampleAnalysisModule } from '../sample-analysis.module';

describe('SampleAnalysisFormComponent', () => {
  let component: SampleAnalysisFormComponent;
  let fixture: ComponentFixture<SampleAnalysisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleAnalysisFormComponent ],
      imports: [AppModule, SampleAnalysisModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleAnalysisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
