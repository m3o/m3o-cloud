import { Injectable } from "@angular/core";
import * as types from "./types";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environment";
import { UserService } from "./user.service";
import * as _ from "lodash";
import { Observable } from "rxjs";

export interface RPCRequest {
  service: string;
  endpoint: string;
  method?: string;
  address?: string;
  request: any;
}

@Injectable({
  providedIn: "root",
})
export class ServiceService {
  constructor(private us: UserService, private http: HttpClient) {}

  url(): string {
    return environment.apiUrl
  }

  namespace(): string {
    return this.us.namespace();
  }

  stats(service: string, version?: string): Promise<types.DebugSnapshot> {
    return new Promise<types.DebugSnapshot>((resolve, reject) => {
      return this.http
        .post<types.DebugSnapshot>(
          environment.apiUrl + "/" + service + "/debug/stats",
          {},
          {
            headers: {
              authorization: this.us.token(),
              "micro-namespace": this.us.namespace(),
            },
          }
        )
        .toPromise()
        .then((servs) => {
          resolve(servs as types.DebugSnapshot);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  trace(service?: string): Promise<types.Span[]> {
    const qs = service ? "service=" + service + "&" : "";
    return new Promise<types.Span[]>((resolve, reject) => {
      resolve([]);
      return;
      return this.http
        .get<types.Span[]>(
          environment.apiUrl + "/debug/trace?" + qs + "limit=1000",
          {
            withCredentials: true,
          }
        )
        .toPromise()
        .then((servs) => {
          resolve(servs as types.Span[]);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  call(rpc: RPCRequest): Promise<string> {
    function toTitleCase(str) {
      return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    return new Promise<string>((resolve, reject) => {
      const endpointName = rpc.endpoint
        .replace(".", "")
        .replace(toTitleCase(rpc.service), "");
      let headers = {
        
        "micro-namespace": this.us.namespace(),
      }
      if (this.us.token()) {
        headers["authorization"] = this.us.token()
      }
      return this.http
        .post<string>(
          environment.apiUrl + "/" + rpc.service + "/" + endpointName,
          JSON.parse(rpc.request),
          {
            headers: headers,
          }
        )
        .toPromise()
        .then((response) => {
          resolve(JSON.stringify(response, null, "  "));
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  events(service?: string): Promise<types.Event[]> {
    const serviceQuery = service ? "?service=" + service : "";
    return new Promise<types.Event[]>((resolve, reject) => {
      resolve([]);
      return;
      return this.http
        .get<types.Event[]>(environment.apiUrl + "/events" + serviceQuery, {
          withCredentials: true,
        })
        .toPromise()
        .then((events) => {
          resolve(_.orderBy(events, (e) => e.timestamp, ["desc"]));
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
