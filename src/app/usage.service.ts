import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface ListUsageResponse {
  usage: Map<string, types.APIUsage>;
}

@Injectable()
export class UsageService {
  constructor(private http: HttpClient, private cookie: CookieService) {}

  listUsage(userID?: string): Promise<Map<string, types.APIUsage>> {
    return new Promise<Map<string, types.APIUsage>>((resolve, reject) => {
      return this.http
        .post<ListUsageResponse>(
          environment.apiUrl + '/usage/Read',
          {
            customer_id: userID,
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token(),
            },
          },
        )
        .toPromise()
        .then((listResponse) => {
          resolve(listResponse.usage);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  token(): string {
    return 'Bearer ' + this.cookie.get('micro_token');
  }
}
