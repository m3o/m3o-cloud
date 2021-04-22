import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

interface CurrentBalanceResponse {
  current_balance: number;
}

interface CheckoutSessionResponse {
  id: string;
}

@Injectable()
export class BalanceService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) {
  }


  getCurrentBalance(userID?: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.http
        .post<CurrentBalanceResponse>(environment.apiUrl + '/balance/Current',
          {
            customer_id: userID,
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then((balResp) => {
          resolve(balResp.current_balance);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getStripeCheckoutSession(amount: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return this.http
        .post<CheckoutSessionResponse>(environment.apiUrl + '/stripe/CreateCheckoutSession',
          {
            amount,
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then((checkoutRsp) => {
          resolve(checkoutRsp.id);
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
