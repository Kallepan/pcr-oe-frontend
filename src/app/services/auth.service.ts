import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, interval, map, Observable, Subscription } from 'rxjs';
import { CONSTANTS } from '../config/constants';
import { ERRORS } from '../config/errors';
import { MessageService } from './message.service';
import { APIResponse } from '../types';

const TOKEN_API_ENDPOINT = `${CONSTANTS.AUTH_API_ENDPOINT}/token`

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router) { }

  private _fetchToken(username: string, password: string): Observable<HttpResponse<APIResponse>> {
    const query_params = {
      username: username,
      password: password,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.post(
      TOKEN_API_ENDPOINT,
      query_params,
      httpOptions).pipe(
        catchError((err) => {
          if (err.status == 401)
            this.messageService.simpleWarnMessage(ERRORS.ERROR_LOGIN_FAILED);
          throw err;
        }),
        map((resp) => {
          return resp as HttpResponse<APIResponse>;
        })
      );
  }

  login(username: string, password: string, dialogRef: any) {
    this._fetchToken(username, password).subscribe({
      next: (resp) => {
        const expiresAt = Date.now() + CONSTANTS.TOKEN_EXPIRY_TIME;

        const data = resp.body?.data;
        localStorage.setItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE, data.token);
        localStorage.setItem(CONSTANTS.JWT_EXPIRES_STORAGE, JSON.stringify(expiresAt.valueOf()));

        localStorage.setItem(CONSTANTS.JWT_USERNAME_STORAGE, username);
        this.setupLoginChecker();
        this.messageService.goodMessage("Login erfolgreich.");
        dialogRef?.close();
      }
    });
  }

  isLoggedIn() {
    if (!localStorage.getItem(CONSTANTS.JWT_EXPIRES_STORAGE)) {
      return false;
    }
    if (!localStorage.getItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE)) {
      return false;
    }
    if (Date.now() > this._getExpiration()) {
      return false;
    }

    return true;
  }

  setupLoginChecker() {
    if (!this.isLoggedIn()) return;

    this.loginSubscription = interval(CONSTANTS.CHECK_LOGIN_TIME).subscribe({
      next: () => {
        if ((this._getExpiration() - Date.now()) < CONSTANTS.EXPIRE_WARN_TIME) {
          alert("Sie werden ausgeloggt.");
          this.logout();
        }
      }
    });
  }

  logout() {
    localStorage.removeItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE);
    localStorage.removeItem(CONSTANTS.JWT_EXPIRES_STORAGE);
    this.router.navigate(['/']);
    this.loginSubscription.unsubscribe();
    alert("Sie wurden ausgeloggt.");
  }

  private _getExpiration(): number {
    const expiration = localStorage.getItem(CONSTANTS.JWT_EXPIRES_STORAGE);
    const expiresAt = expiration ? JSON.parse(expiration) : 0;

    return expiresAt;
  }

}
