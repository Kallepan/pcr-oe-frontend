import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleTableComponent } from './sample-table.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

describe('SampleTableComponent', () => {
  let component: SampleTableComponent;
  let fixture: ComponentFixture<SampleTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleTableComponent ],
      imports: [AppModule, SamplesModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
