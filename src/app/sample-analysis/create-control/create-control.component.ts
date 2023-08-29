import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERRORS } from 'src/app/config/errors';
import { ControlsService } from 'src/app/services/controls.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-create-control',
  templateUrl: './create-control.component.html',
  styleUrls: ['./create-control.component.scss']
})
export class CreateControlComponent {
  @Output() addControlRequest = new EventEmitter<string>();

  controlFormGroup: FormGroup;

  constructor(
    private _controlsService: ControlsService,
    private _messageService: MessageService,
  ) {
    const fb = new FormBuilder();

    this.controlFormGroup = fb.group({
      typeControl: [_controlsService.controlData.type, [Validators.required]],
      analytControl: [_controlsService.controlData.analyt, [Validators.required]],
      customControl: ["", [Validators.pattern(/^[a-zA-Z]{0,10}$/)] ],
    });
    this.controlFormGroup.controls['customControl'].disable();
  }

  toggleCustomForm(event: any): void {
    if (event?.value === 'custom') {
      this.controlFormGroup.controls['customControl'].enable();
    } else {
      this.controlFormGroup.controls['customControl'].disable();
    }
  }

  getTypes(): string[] {
    return this._controlsService.types;
  }

  getAnalytes(): string[] {
    return this._controlsService.analytes;
  }

  getAnlytLabel(): string {
    let analyt = this.controlFormGroup.controls['analytControl'].value;
    if (analyt === 'custom') {
      analyt = this.controlFormGroup.controls['customControl'].value;
    }

    return analyt;
  }

  addControl(): void {
    if (this.controlFormGroup.invalid) {
      this._messageService.simpleWarnMessage(ERRORS.ERROR_INVALID_FORM);
      return;
    }
    
    // STD 2-5
    if (this.controlFormGroup.controls['typeControl'].value === 'STD 2-5') {
      const types = [
        'STD 2',
        'STD 3',
        'STD 4',
        'STD 5',
      ];
      types.forEach(type => {
        this._controlsService.controlData.type = type;
        this._controlsService.controlData.analyt = this.getAnlytLabel();
        const controlString = this._controlsService.getControlString();
        this.addControlRequest.emit(controlString);
      });
      return;
    }

    this._controlsService.controlData.type = this.controlFormGroup.controls['typeControl'].value;
    this._controlsService.controlData.analyt = this.getAnlytLabel();
    const controlString = this._controlsService.getControlString();
    this.addControlRequest.emit(controlString);
  }
}
