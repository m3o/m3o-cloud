import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import * as types from './types';
import { Router } from '@angular/router';
import { TrackingService } from './tracking.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment';

// see https://fireflysemantics.medium.com/creating-a-custom-angular-material-google-social-login-button-aee2fe376ea5
const googleLogoURL =
  'https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg';

var hotjarCode = `(function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: 2533791, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');`;

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
    @Inject(DOCUMENT) private doc: any,
  ) {}

  ngOnInit() {
    if (environment.production) {
      this.addHotJar()
    }
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

  // see https://github.com/angular/angular-cli/issues/4451
  private addHotJar() {
    const s = this.doc.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML = hotjarCode;
    const head = this.doc.getElementsByTagName('head')[0];
    head.appendChild(s);
  }

  private addGoogleAnalytics() {}
}
