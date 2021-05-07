import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import {Adjustment, Card, Payment} from './types';

interface CurrentBalanceResponse {
  current_balance: number;
}

interface CheckoutSessionResponse {
  id: string;
}

interface ListCardsResponse {
  cards: Card[];
}

interface ChargeCardResponse {
  client_secret: string;
}

interface ListAdjustmentsResponse {
  adjustments: Adjustment[];
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
            save_card: true,
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

  getSavedCards(): Promise<Card[]> {
    return new Promise<Card[]>((resolve, reject) => {
      return this.http
        .post<ListCardsResponse>(environment.apiUrl + '/stripe/listCards',
          {
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then((listRsp) => {
          resolve(listRsp.cards);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  chargeCard(id: string, amount: number): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      return this.http
        .post<ChargeCardResponse>(environment.apiUrl + '/stripe/chargeCard',
          {
            id,
            amount
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then((rsp) => {
          resolve(rsp.client_secret);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  deleteCard(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      return this.http
        .post<void>(environment.apiUrl + '/stripe/deleteCard',
          {
            id,
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then(() => {
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getAdjustments(): Promise<Adjustment[]> {
    return new Promise<Adjustment[]>((resolve, reject) => {
      return this.http
        .post<ListAdjustmentsResponse>(environment.apiUrl + '/balance/ListAdjustments',
          {
          },
          {
            headers: {
              'Micro-Namespace': 'micro',
              authorization: this.token()
            }
          })
        .toPromise()
        .then((listRsp) => {
          resolve(listRsp.adjustments);
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
