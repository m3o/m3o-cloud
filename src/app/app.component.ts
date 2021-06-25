import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';
import * as types from './types';
import { Router } from '@angular/router';
import { TrackingService } from './tracking.service';

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
    private us: UserService,
    private router: Router,
    private ts: TrackingService
  ) {}

  ngOnInit() {
    this.user = this.us.user;
    this.us.isUserLoggedIn.subscribe(() => {
      this.user = this.us.user;
    });

    this.ts.trackFirstVisit()
  }

  goToTeam() {
    window.location.replace('team url???');
  }

  currentURL(): string {
    return this.router.url.split('?')[0];
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.submit();
    }
  }

  submit() {
    this.router.navigate(['/explore'], {
      queryParams: {
        q: this.search,
      },
    });
  }
}
