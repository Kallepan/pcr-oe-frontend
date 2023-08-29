import { MatDateFormats } from '@angular/material/core';
import { environment } from '../environments/environment';

export interface navLink {
    routerLink: string;
    display_name: string;
    description: string;
    primary: boolean;
    type?: string;
    disabled: boolean;
}

export class CONSTANTS {
    public static DATE_FORMATS: MatDateFormats = {
        parse: {
          dateInput: 'YYYY-MM-DD',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }

    public static TITLE = "PCR OrderEntry";
    public static VERSION = "1.0";

    public static GLOBAL_API_ENDPOINT = environment.apiUrl;
    public static AUTH_API_ENDPOINT = environment.authUrl;

    // One hour time in minutes, seconds and miliseconds
    public static TOKEN_EXPIRY_TIME = 720 * 60 * 1000;

    public static CHECK_LOGIN_TIME = 1000 * 60 * 15;
    public static EXPIRE_WARN_TIME = 1000 * 60 * 30;

    public static JWT_ACCESS_TOKEN_STORAGE = 'jwt_acccess_token';
    public static JWT_EXPIRES_STORAGE = 'expires_at';
    public static JWT_USERNAME_STORAGE = 'username';

    public static NAV_LINKS: navLink[] = [
        { routerLink: '/laeufe/suche', disabled: false, display_name: 'Suche', type: 'Laufsuche', primary: true, description: "Suche nach Läufen." },
        { routerLink: '/laeufe', disabled: false, display_name: 'Läufe', type: 'Erstellen', primary: true, description: "Erstellung von Läufen." },
        { routerLink: '/proben/search', disabled: false, display_name: 'Suche', type: 'Probensuche', primary: true, description: 'Proben aus dem Archiv raussuchen.' },
        { routerLink: '/proben', disabled: false, display_name: 'Proben', type: 'Eingang', primary: true, description: "Vergabe von Gennummer." },
        { routerLink: '/changelog', disabled: false, display_name: 'Changelog', type: 'Changelog', primary: false, description: "Changelog." },
    ];

    public static PANELS = [
        "CMV",
        "EBV",
        "HEV",
        "PNJ",
        "MTB",
        "MDR",
        "RB",
        "CLO"
    ];

    public static DEVICES = [
        "IG01",
        "IG02",
        "IG03",
        "IG04",
    ];

    public static RUNS = [
        "L01",
        "L02",
        "L03",
        "L04",
    ];
}
