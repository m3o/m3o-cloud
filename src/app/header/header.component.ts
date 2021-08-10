import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import * as types from '../types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: types.Account;

  mobileMenuOpen = false;

  constructor(
    private cs: CookieService,
    public us: UserService,
    private router: Router,
  ) {
    this.user = this.us.user;

    this.us.isUserLoggedIn.subscribe(() => {
      this.user = this.us.user;
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
}
