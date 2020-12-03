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
export class RegistryService {
  constructor(private us: UserService, private http: HttpClient) {}

  get(serviceName: string): Promise<types.Service> {
    return new Promise<types.Service>((resolve, reject) => {
      return this.http
        .post<ServicesResponse>(
          environment.apiUrl + "/registry/getService",
          {
            service: serviceName,
            options: {
              domain: this.us.namespace(),
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
          resolve(servs.services[0] as types.Service);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  list(): Promise<types.Service[]> {
    return new Promise<types.Service[]>((resolve, reject) => {
      return this.http
        .post<ServicesResponse>(
          environment.apiUrl + "/registry/listServices",
          {
            options: {
              domain: this.us.namespace(),
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
}
