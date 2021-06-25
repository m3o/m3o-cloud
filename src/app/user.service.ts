import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { V1ApiService } from './v1api.service';

interface ReadUserResponse {
  user: types.Account;
}

interface InspectResponse {
  account: types.Account;
}

interface Token {
  access_token: string;
  refresh_token: string;
  created: string;
  expiry: string;
}

interface TokenResponse {
  token: Token;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  created: string;
  expiry: string;
  issuer: string;
}

interface CompleteSignupResponse {
  authToken: Token;
  namespace: string;
}

@Injectable()
export class UserService {
  public user: types.Account = {} as types.Account;
  public isUserLoggedIn = new Subject<boolean>();
  private refreshing = false;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private notif: ToastrService,
    private router: Router,
    private v1api: V1ApiService
  ) {
    this.get()
      .then((user) => {
        for (const k of Object.keys(user)) {
          this.user[k] = user[k];
        }
        this.isUserLoggedIn.next(true);
      })
      .catch((e) => {
        this.isUserLoggedIn.next(false);
      });
  }

  loggedIn(): boolean {
    return this.user && this.user.name !== undefined;
  }

  logout() {
    // todo We are nulling out the name here because that's what we use
    // for user existence checks.
    this.user.name = '';
    this.cookie.set('micro_token', '', 30, '/', null, null, null);
    this.cookie.set('micro_refresh', '', 30, '/', null, null, null);
    this.cookie.set('micro_expiry', '', 30, '/', null, null, null);
    this.v1api.revokeKey(this.cookie.get('micro_api_token'));
    this.cookie.set('micro_api_token', '', 30, '/', null, null, null);
    document.location.href = '/login';
  }

  // gets current user
  get(): Promise<types.Account> {
    return new Promise<types.Account>((resolve, reject) => {
      if (!this.cookie.get('micro_token')) {
        return reject('Cookie not found');
      }
      return this.refresh().then(() => {
        return this.http
          .post<InspectResponse>(environment.apiUrl + '/auth/Auth/Inspect', {
            token: this.cookie.get('micro_token'),
            options: {
              namespace: this.namespace(),
            },
          })
          .toPromise()
          .then((userResponse) => {
            const user = userResponse.account;
            if (!user.name) {
              user.name = user.id;
            }
            resolve(user);
          })
          .catch((e) => {
            reject(e);
          });
      });
    });
  }

  token(): string {
    return 'Bearer ' + this.cookie.get('micro_token');
  }

  refreshToken(): string {
    return this.cookie.get('micro_refresh');
  }

  namespace(): string {
    return this.cookie.get('micro_namespace');
  }

  login(email: string, password: string, namespace: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(environment.apiUrl + '/auth/Auth/Token', {
          id: email,
          secret: password,
          options: {
            namespace: namespace,
          },
          token_expiry: 30 * 24 * 3600,
        })
        .toPromise()
        .then((tresp) => {
          const tok = tresp.token;
          // ugly param list, see: https://github.com/stevermeister/ngx-cookie-service/issues/86
          this.cookie.set(
            'micro_token',
            tok.access_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_refresh',
            tok.refresh_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_expiry',
            tok.expiry,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_namespace',
            namespace,
            30,
            '/',
            null,
            null,
            null
          );
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  sendRecover(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/onboarding/signup/recover',
          {
            email: email,
          },
          {
            headers: {
              'Micro-Namespace': environment.namespace,
            },
          }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<void> {
    var headers = {
      'Micro-Namespace': environment.namespace,
    };
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/onboarding/signup/resetPassword',
          {
            email: email,
            token: token,
            password: newPassword,
          },
          { headers: headers }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  sendVerification(email: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/onboarding/signup/SendVerificationEmail',
          {
            email: email,
          }
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  track(t: types.Track): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<TokenResponse>(
          environment.apiUrl + '/onboarding/signup/Track',
          t
        )
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  verify(
    email: string,
    password: string,
    verificationCode: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<CompleteSignupResponse>(
          environment.apiUrl + '/onboarding/signup/CompleteSignup',
          {
            email: email,
            token: verificationCode,
            secret: password,
          }
        )
        .toPromise()
        .then((resp) => {
          const tok = resp.authToken;
          this.cookie.set(
            'micro_token',
            tok.access_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_refresh',
            tok.refresh_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_expiry',
            tok.expiry,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_namespace',
            resp.namespace,
            30,
            '/',
            null,
            null,
            null
          );
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  refresh(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var expiry = parseInt(this.cookie.get('micro_expiry')) * 1000;
      if (this.refreshing || expiry - Date.now() > 60 * 1000) {
        return resolve();
      }
      this.refreshing = true;
      return this.http
        .post<TokenResponse>(environment.apiUrl + '/auth/Auth/Token', {
          refresh_token: this.cookie.get('micro_refresh'),
          options: {
            namespace: this.namespace(),
          },
          token_expiry: 30 * 24 * 3600,
        })
        .toPromise()
        .then((tokenResponse) => {
          const tok = tokenResponse.token;
          // ugly param list, see: https://github.com/stevermeister/ngx-cookie-service/issues/86
          this.cookie.set(
            'micro_token',
            tok.access_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_refresh',
            tok.refresh_token,
            30,
            '/',
            null,
            null,
            null
          );
          this.cookie.set(
            'micro_expiry',
            tok.expiry,
            30,
            '/',
            null,
            null,
            null
          );
          this.refreshing = false;
          resolve();
        })
        .catch((e) => {
          this.refreshing = false;
          reject(e);
        });
    });
  }
}
