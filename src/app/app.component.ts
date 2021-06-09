import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import * as types from './types';

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

  constructor(public us: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.us.user;
    this.us.isUserLoggedIn.subscribe(() => {
      this.user = this.us.user;
    });
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
