import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser }
from '@angular/common';
import * as types from './types';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TrackingService {
  isBrowser = false
  constructor(private cs: CookieService, private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  trackVerification(email: string) {
    let firstVerification = this.cs.get('first_verification');
    if (!firstVerification) {
      let fverif = Math.floor(Date.now() / 1000);
      let id = this.cs.get('tr_id');
      this.cs.set(
        'first_verification',
        fverif + '',
        365,
        '/',
        null,
        null,
        null
      );
      this.track({ id: id, firstVerification: fverif, email: email });
    }
  }

  trackRegistration() {
    let reg = Math.floor(Date.now() / 1000);
    let id = this.cs.get('tr_id');
    this.track({ id: id, registration: reg });
  }

  trackFirstVisit() {
    if (!this.isBrowser) {
      return
    }
    let firstVisit = this.cs.get('first_visit');
    if (!firstVisit) {
      let fvisit = Math.floor(Date.now() / 1000);
      let id = uuid.v4();
      this.cs.set('tr_id', id, 365, '/', null, null, null);
      this.cs.set('first_visit', fvisit + '', 365, '/', null, null, null);
      this.track({
        id: id,
        firstVisit: fvisit,
        referrer: document.referrer,
      });
    }
  }

  track(t: types.Track): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post(environment.apiUrl + '/onboarding/signup/Track', t)
        .toPromise()
        .then((userResponse) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
