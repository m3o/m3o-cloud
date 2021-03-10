import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface ListUsageResponse {
  usages: types.QuotaUsage[];
}

interface ListQuotasResponse {
  quotas: types.Quota      [];
}

interface GenerateKeyResponse {
  api_key: string;
}

@Injectable()
export class QuotaService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {
  }

  listUsage(userID?: string, namespace?: string): Promise<types.QuotaUsage[]> {
    return new Promise<types.QuotaUsage[]>((resolve, reject) => {
      return this.http
        .post<ListUsageResponse>(environment.apiUrl + '/quota/ListUsage',
          {
            user_id: userID,
            namespace,
          },
          {
            headers: {
              'Micro-Namespace' : 'micro',
              authorization: this.token()
            }})
        .toPromise()
        .then((listResponse) => {
          resolve(listResponse.usages);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  listQuotas(): Promise<types.Quota[]> {
    return new Promise<types.Quota[]>((resolve, reject) => {
      return this.http
        .post<ListQuotasResponse>(environment.apiUrl + '/quota/list',
          {},
          {
            headers: {
              'Micro-Namespace' : 'micro',
              authorization: this.token()
            }})
        .toPromise()
        .then((listResponse) => {
          resolve(listResponse.quotas);
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
