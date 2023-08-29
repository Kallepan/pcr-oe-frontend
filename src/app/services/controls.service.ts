import { Injectable } from '@angular/core';
import { CONSTANTS } from '../config/constants';

export type ControlData = {
  type: string;
  analyt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ControlsService {
  types = [
    'POS KO',
    'NEG KO',
    'STD 2-5',
  ]
  analytes: string[] = CONSTANTS.PANELS;

  controlData: ControlData;

  constructor(
  ) {
    this.controlData = {
      type: 'POS KO',
      analyt: 'CMV'
    }
  }

  getControlString(): string {
    return `${this.controlData.type}, ${this.controlData.analyt}`;
  }
}
