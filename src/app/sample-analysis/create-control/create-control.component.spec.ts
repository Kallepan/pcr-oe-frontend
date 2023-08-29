import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateControlComponent } from './create-control.component';
import { AppModule } from 'src/app/app.module';
import { SampleAnalysisModule } from '../sample-analysis.module';

describe('CreateControlComponent', () => {
  let component: CreateControlComponent;
  let fixture: ComponentFixture<CreateControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule, SampleAnalysisModule],
      declarations: [ CreateControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
