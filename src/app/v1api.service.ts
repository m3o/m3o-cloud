import { Injectable } from '@angular/core';
import * as types from './types';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface APIKeyEntry {
  id: string;
  description: string;
  created_time: number;
  scopes: string[];
}

interface ListKeysResponse {
  api_keys: APIKeyEntry[];
}

interface GenerateKeyResponse {
  api_key: string;
}

@Injectable()
export class V1ApiService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {
  }


  // listKeys returns the API keys for this user
  listKeys(): Promise<types.APIKey[]> {
    return new Promise<types.APIKey[]>((resolve, reject) => {
      return this.http
        .post<ListKeysResponse>(environment.apiUrl + '/v1/api/keys/list',
          {},
          {
            headers: {
              'Micro-Namespace' : 'micro',
              authorization: this.token()
            }})
        .toPromise()
        .then((listResponse) => {
          const keys = [] as types.APIKey[];
          listResponse.api_keys.forEach(value => {
            const k = {} as types.APIKey;
            k.description = value.description;
            k.id = value.id;
            k.createdTime = value.created_time;
            k.scopes = value.scopes;
            keys.push(k);
          });

          resolve(keys);
        })
        .catch((e) => {
          reject(e);
        });
    });

  }

  // revokeKey deletes the given key
  revokeKey(key: types.APIKey): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<void>(environment.apiUrl + '/v1/api/keys/revoke',
          {id: key.id},
          {
            headers: {
              'Micro-Namespace' : 'micro',
              authorization: this.token()
            }})
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  // createKey generates a new key
  createKey(description: string, scopes: string[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return this.http
        .post<GenerateKeyResponse>(environment.apiUrl + '/v1/api/keys/generate',
          {description, scopes},
          {
            headers: {
              'Micro-Namespace' : 'micro',
              authorization: this.token()
            }})
        .toPromise()
        .then((resp) => {
          resolve(resp.api_key);
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
