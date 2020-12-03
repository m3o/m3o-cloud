import { Injectable } from "@angular/core";
import * as types from "./types";
import { HttpClient } from "@angular/common/http";
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

  logs(service: string): Observable<types.LogRecord> {
    return this.http.post<types.LogRecord>(
      environment.apiUrl + "/runtime/logs",
      {
        service: service,
        stream: true,
        options: {
          namespace: this.us.namespace(),
        },
      },
      {
        headers: {
          authorization: this.us.token(),
          //"micro-namespace": this.us.namespace(),
        },
      }
    );

    //.then((servs) => {
    //  resolve(servs as types.LogRecord[]);
    //})
    //.catch((e) => {
    //  reject(e);
    //});
  }
}
