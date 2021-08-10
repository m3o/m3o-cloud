import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import * as types from '../types';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: types.Account;

  mobileMenuOpen = false;

  constructor(
    private cs: CookieService,
    public userService: UserService,
    public searchService: SearchService,
    private router: Router,
  ) {
    this.user = this.userService.user;

    this.userService.isUserLoggedIn.subscribe(() => {
      this.user = this.userService.user;
    });
  }

  ngOnInit() {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  userIsNotLoggedIn(): boolean {
    return !this.userService.loggedIn() || !this.user || !this.user.name;
  }
}
