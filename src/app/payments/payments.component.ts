import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';

import {BalanceService} from '../balance.service';
import {
  loadStripe,
} from '@stripe/stripe-js';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  balance: string;
  creditAmount: string;
  stripePromise = loadStripe(environment.stripeKey);

  constructor(
    public balanceSvc: BalanceService,
  ) {

  }

  ngOnInit(): void {
    this.getBalance();
  }

  getBalance(): void {
    this.balanceSvc.getCurrentBalance()
      .then( bal => {
        // bal is a number representing 1/100ths of a cent
        this.balance = '$' + (bal / 10000).toFixed(2);
      }).catch(e => {
      console.log(e);
    });
  }

  async stripeCheckout() {
    const stripe = await this.stripePromise;
    const response = await this.balanceSvc.getStripeCheckoutSession(Number.parseFloat( this.creditAmount ) * 100);
    const result = await stripe.redirectToCheckout({
      sessionId: response,
    });
    if (result.error) {
      // TODO display this error to customer
      console.log(result.error.message);
    }
  }



}
