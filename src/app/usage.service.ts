import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface ListUsageResponse {
  usage: Map<string, types.APIUsage>;
}

export interface Event {
  table: string;
  id: string;
  record: any;
  createdAt: string;
}

export interface ListEventsResponse {
  events: Event[];
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

  // this endpoint should only be called in when the user is logged in
  saveEvent(table: string, event: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<void>(
          environment.apiUrl + '/usage/SaveEvent',
          {
            event: {
              table: table,
              record: event,
            },
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
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  listEvents(table: string): Promise<ListEventsResponse> {
    return new Promise<ListEventsResponse>((resolve, reject) => {
      return this.http
        .post<ListEventsResponse>(
          environment.apiUrl + '/usage/ListEvents',
          {
            table: table,
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
          resolve(listResponse);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // Since we can't save the api visits for unregistered users,
  // nor we want to save a huge list of it,
  // we instead place the last visited api into a cookie.
  // This will enable us to show something on the overview page
  // after they sign up.
  recordApiVisitForUnregisteredUsers(apiName: string) {

  }
}
