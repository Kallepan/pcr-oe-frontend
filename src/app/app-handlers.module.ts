import { ErrorHandler, Injectable } from "@angular/core";
import { MessageService } from "./services/message.service";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(private _messageService: MessageService) { }

    handleError(error: any): void {
      switch (error.status) {
        case 404:
          this._messageService.simpleWarnMessage('404 - Nicht gefunden');
          return;
      }
      const errorMessage = error.message ? error.message : error.toString();
      this._messageService.simpleWarnMessage(errorMessage);
    }
}