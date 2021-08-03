import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import { Account } from '../types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: Account;

  constructor(private cs: CookieService, private userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.user;

    this.userService.isUserLoggedIn.subscribe(() => {
      this.user = this.userService.user;
    });
  }
}
