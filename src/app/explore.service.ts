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
  examplesJSON: string;
}

export interface IndexResponse {
  services: Service[];
}

export interface SearchResponse {
  services: Service[];
}

export interface ServiceResponse {
  service: Service;
}

@Injectable({
  providedIn: 'root',
})
export class ExploreService {
  constructor(private us: UserService, private http: HttpClient) {}

  index(): Promise<Service[]> {
    return new Promise<Service[]>((resolve, reject) => {
      return this.http
        .post<IndexResponse>(
          environment.apiUrl + '/explore/Index', {},
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

  service(name: string): Promise<Service> {
    return new Promise<Service>((resolve, reject) => {
      return this.http
        .post<ServiceResponse>(
          environment.apiUrl + '/explore/Service',
          {
            name: name,
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
        .then((rsp) => {
          resolve(rsp.service as Service);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  saveMeta(
    serviceName: string,
    readme: string,
    openAPIJSON: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<SearchResponse>(
          environment.apiUrl + '/explore/SaveMeta',
          {
            readme: readme,
            openAPIJSON: openAPIJSON,
            serviceName: serviceName,
          },
          {
            headers: {
              authorization: this.us.token(),
              'micro-namespace': this.us.namespace(),
              'Micro-Namespace': 'micro',
            },
          }
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
