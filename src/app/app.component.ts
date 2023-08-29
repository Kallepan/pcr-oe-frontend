import { Component } from '@angular/core';
import { CONSTANTS } from './config/constants';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = CONSTANTS.TITLE;
  version = CONSTANTS.VERSION;
  year = new Date().getFullYear();

  primaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => navLink.primary).reverse();
  secondaryNavLinks = CONSTANTS.NAV_LINKS.filter(navLink => !navLink.primary)

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.setupLoginChecker();
  }
}
