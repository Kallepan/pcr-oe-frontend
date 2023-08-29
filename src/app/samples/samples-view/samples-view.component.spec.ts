import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplesViewComponent } from './samples-view.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

describe('SamplesViewComponent', () => {
  let component: SamplesViewComponent;
  let fixture: ComponentFixture<SamplesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SamplesViewComponent ],
      imports: [SamplesModule, AppModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SamplesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
