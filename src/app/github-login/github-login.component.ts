import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-github-login',
  templateUrl: './github-login.component.html',
  styleUrls: ['./github-login.component.css'],
})
export class GithubLoginComponent implements OnInit {
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
      if (!this.isBrowser) {
        return;
      }
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
        this.us
          .githubOauthCallback(this.code, this.state, this.errorReason)
          .then((isSignup) => {
            if (isSignup) {
              document.location.href = '/getting-started';
              return;
            }
            document.location.href = '/explore';
          });
      }
    });
  }
}
