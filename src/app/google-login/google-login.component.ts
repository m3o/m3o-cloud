import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css'],
})
export class GoogleLoginComponent implements OnInit {
  isBrowser = false;

  constructor(
    private route: ActivatedRoute,
    public us: UserService,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  code: string;
  state: string;
  errorReason: string;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.get('code')) {
        this.code = queryParams.get('code');
      }

      if (queryParams.get('state')) {
        this.state = queryParams.get('state');
      }

      if (queryParams.get('error_reason')) {
        this.errorReason = queryParams.get('error_reason');
      }

      if (this.code) {
        this.us.googleOauthCallback(this.code, this.state, this.errorReason);
      }
    });
  }
}
