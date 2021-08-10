import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import * as types from '../types';

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
    private router: Router,
  ) {
    this.user = this.userService.user;

    this.userService.isUserLoggedIn.subscribe(() => {
      this.user = this.userService.user;
    });
  }

  ngOnInit() {}

  submit(searchText: string): void {
    this.router.navigate(['/explore'], {
      queryParams: {
        q: searchText,
      },
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  userIsNotLoggedIn(): boolean {
    return !this.userService.loggedIn() || !this.user || !this.user.name;
  }
}
