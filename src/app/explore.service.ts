import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserService } from './user.service';

export interface PublicAPI {
  name: string;
  display_name: string;
  description: string;
  open_api_json: string;
  examples_json?: string;
  icon: string;
  category: string;
  pricing?: Record<string, string>;
  postman_json: string;
}

export interface ExploreAPI {
  name: string;
  display_name: string;
  description: string;
  category: string;
  icon: string;
  endpoints: Endpoint[];
}

export interface API {
  api: PublicAPI;
  summary: ExploreAPI;
}

export interface Endpoint {
  name: string;
  // internally defined
  requestJSON: string;
  responseJSON: string;
  requestValue: any;
  responseValue: any;
}

export interface IndexResponse {
  apis: ExploreAPI[];
}

export interface SearchResponse {
  apis: ExploreAPI[];
}

export interface APIResponse {
  api: PublicAPI;
  summary: ExploreAPI;
}

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  constructor(private us: UserService, private http: HttpClient) {}

  index(limit?: number, offset?: number): Promise<ExploreAPI[]> {
    return new Promise<ExploreAPI[]>((resolve, reject) => {
      return this.http
        .post<IndexResponse>(
          environment.apiUrl + '/publicapi/explore/Index',
          {
            limit: limit ? limit : 0,
            offset: offset ? offset : 0,
          },
          {},
        )
        .toPromise()
        .then((servs) => {
          resolve(servs.apis as ExploreAPI[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  search(searchTerm?: string): Promise<ExploreAPI[]> {
    return new Promise<ExploreAPI[]>((resolve, reject) => {
      return this.http
        .post<SearchResponse>(
          environment.apiUrl + '/publicapi/explore/Search',
          {
            search_term: searchTerm,
          },
          {},
        )
        .toPromise()
        .then((servs) => {
          resolve(servs.apis as ExploreAPI[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  service(name: string): Promise<API> {
    return new Promise<API>((resolve, reject) => {
      return this.http
        .post<APIResponse>(
          environment.apiUrl + '/publicapi/explore/API',
          {
            name,
          },
          {},
        )
        .toPromise()
        .then((rsp) => {
          resolve(rsp as API);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  saveMeta(
    serviceName: string,
    readme: string,
    openAPIJSON: string,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<SearchResponse>(
          environment.apiUrl + '/explore/publish',
          {
            description: readme,
            open_api_json: openAPIJSON,
            name: serviceName,
          },
          {
            headers: {
              authorization: this.us.token(),
              'micro-namespace': this.us.namespace(),
              'Micro-Namespace': 'micro',
            },
          },
        )
        .toPromise()
        .then((servs) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
