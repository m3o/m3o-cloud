import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import * as types from './types';
import { Router } from '@angular/router';
import { TrackingService } from './tracking.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

// see https://fireflysemantics.medium.com/creating-a-custom-angular-material-google-social-login-button-aee2fe376ea5
const googleLogoURL =
  'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  title = 'micro';
  user: types.Account;
  search: string;

  constructor(
    private cs: CookieService,
    public us: UserService,
    private router: Router,
    private ts: TrackingService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.matIconRegistry.addSvgIcon(
      'logo',
      this.domSanitizer.bypassSecurityTrustResourceUrl(googleLogoURL),
    );

    this.user = this.us.user;

    this.us.isUserLoggedIn.subscribe(() => {
      this.user = this.us.user;
    });

    this.ts.trackFirstVisit();
  }

  goToTeam() {
    window.location.replace('team url???');
  }

  currentURL(): string {
    return this.router.url.split('?')[0];
  }

  submit(searchText: string): void {
    this.router.navigate(['/explore'], {
      queryParams: {
        q: searchText,
      },
    });
  }
}
