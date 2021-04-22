import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

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
  stripePromise = loadStripe('pk_test_wuI8wlKwKBUZ9iHnYlQPa8BH');

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
    const response = await this.balanceSvc.getStripeCheckoutSession(1000);
    const result = await stripe.redirectToCheckout({
      sessionId: response,
    });
    if (result.error) {
      // TODO display this error to customer
      console.log(result.error.message);
    }
  }



}
