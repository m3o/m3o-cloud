import { Injectable } from '@angular/core';
import * as types from './types';
import {
  HttpClient,
  HttpEventType,
  HttpDownloadProgressEvent,
} from '@angular/common/http';
import { environment } from '../environments/environment';
import { UserService } from './user.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';

export interface Service {
  service: types.Service;
  readme: string;
  openAPIJSON: string;
}

export interface SearchResponse {
  services: Service[];
}

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  constructor(private us: UserService, private http: HttpClient) {}

  search(searchTerm?: string): Promise<Service[]> {
    return new Promise<Service[]>((resolve, reject) => {
      return this.http
        .post<SearchResponse>(
          environment.apiUrl + '/explore/Search',
          {
            searchTerm: searchTerm,
          },
          {
            //headers: {
            //authorization: this.us.token(),
            //"micro-namespace": this.us.namespace(),
            //'Micro-Namespace': 'micro',
            //},
          }
        )
        .toPromise()
        .then((servs) => {
          resolve(servs.services as Service[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
