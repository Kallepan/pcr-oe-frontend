import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSampleCommentDialogComponent } from './edit-sample-comment-dialog.component';
import { AppModule } from 'src/app/app.module';
import { SamplesModule } from '../samples.module';

describe('EditSampleCommentDialogComponent', () => {
  let component: EditSampleCommentDialogComponent;
  let fixture: ComponentFixture<EditSampleCommentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSampleCommentDialogComponent ],
      imports: [AppModule, SamplesModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSampleCommentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
