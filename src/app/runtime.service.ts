import { Injectable } from "@angular/core";
import * as types from "./types";
import {
  HttpClient,
  HttpEventType,
  HttpDownloadProgressEvent,
} from "@angular/common/http";
import { environment } from "../environments/environment";
import { UserService } from "./user.service";
import * as _ from "lodash";
import { Observable } from "rxjs";

export interface ServicesResponse {
  services: types.Service[];
}

@Injectable({
  providedIn: "root",
})
export class RuntimeService {
  constructor(private us: UserService, private http: HttpClient) {}

  list(): Promise<types.Service[]> {
    return new Promise<types.Service[]>((resolve, reject) => {
      return this.http
        .post<ServicesResponse>(
          environment.apiUrl + "/runtime/read",
          {
            options: {
              namespace: this.us.namespace(),
            },
          },
          {
            headers: {
              authorization: this.us.token(),
              //"micro-namespace": this.us.namespace(),
              "Micro-Namespace": "micro",
            },
          }
        )
        .toPromise()
        .then((servs) => {
          resolve(servs.services as types.Service[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  create(name: string, source: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post(
          environment.apiUrl + "/runtime/create",
          {
            resource: {
              service: {
                name: name,
                source: source,
              },
            },
            options: {
              namespace: this.us.namespace(),
            },
          },
          {
            headers: {
              authorization: this.us.token(),
              "micro-namespace": "micro",
            },
          }
        )
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  delete(name: string, version: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post(
          environment.apiUrl + "/runtime/delete",
          {
            resource: {
              service: {
                name: name,
                version: version,
              },
            },
            options: {
              namespace: this.us.namespace(),
            },
          },
          {
            headers: {
              authorization: this.us.token(),
              "micro-namespace": "micro",
            },
          }
        )
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  logs(service: string): Promise<Response> {
    return fetch(environment.apiUrl + "/runtime/logs", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        authorization: this.us.token(),
        "micro-namespace": "micro",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        service: service,
        stream: true,
        count: 0,
        options: {
          namespace: this.us.namespace(),
        },
      }), // body data type must match "Content-Type" header
    });
  }
}
