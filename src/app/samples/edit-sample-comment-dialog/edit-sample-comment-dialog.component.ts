import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ERRORS } from 'src/app/config/errors';
import { MessageService } from 'src/app/services/message.service';
import { Sample } from '../samples';

@Component({
  selector: 'app-edit-sample-comment-dialog',
  templateUrl: './edit-sample-comment-dialog.component.html',
  styleUrls: ['./edit-sample-comment-dialog.component.scss']
})
export class EditSampleCommentDialogComponent {
  sampleForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<EditSampleCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _messageService: MessageService,
  ) {
    const fb = new FormBuilder();
    this.sampleForm = fb.group({
      comment: [data.sample.comment, [Validators.maxLength(255)]],
    });
  }


  confirm() {
    if (this.sampleForm.invalid) {
      this._messageService.simpleWarnMessage(ERRORS.INVALID_INPUT);
      return
    }

    const sample: Sample = this.data.sample;
    sample.comment = this.sampleForm.value.comment;

    this.dialogRef.close(sample);
  }
}
