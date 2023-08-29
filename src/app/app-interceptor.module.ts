import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { CONSTANTS } from "./config/constants";

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if logged in
    if (!this.authService.isLoggedIn()) {
      return next.handle(req);
    }

    // Check if target url is auth api endpoint
    if (!req.url.includes(CONSTANTS.AUTH_API_ENDPOINT)) {
      return next.handle(req);
    }

    const JWT_ACCESS_TOKEN = localStorage.getItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE) || "";

    const clonedReq = req.clone({
      headers: req.headers.set("Authorization", JWT_ACCESS_TOKEN)
    });

    // Send request with token
    return next.handle(clonedReq);
  }
}