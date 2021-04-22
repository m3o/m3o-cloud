import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from './user.service';
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

  constructor(public us: UserService) {}

  ngOnInit() {
    this.user = this.us.user;
    this.us.isUserLoggedIn.subscribe(() => {
      this.user = this.us.user;
    });
  }

  goToTeam() {
    window.location.replace('team url???');
  }
}
