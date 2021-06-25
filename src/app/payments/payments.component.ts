import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';

import {BalanceService} from '../balance.service';
import {
  loadStripe, Stripe
} from '@stripe/stripe-js';
import {Adjustment, Card} from '../types';
import {FormControl} from '@angular/forms';
import {UserService} from '../user.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  balance: string;
  creditAmount: number;
  cards: Card[] = [] as Card[];
  cardForm = new FormControl();
  successMessage: string;
  adjustments: Adjustment[] = [] as Adjustment[];
  stripePromise: Promise<Stripe>;

  constructor(
    public balanceSvc: BalanceService,
    private us: UserService,
  ) {
    if (this.us.user.name.endsWith('@m3o.com')) {
      this.stripePromise = loadStripe(environment.testStripeKey);
    } else {
      this.stripePromise = loadStripe(environment.stripeKey);
    }
  }

  ngOnInit(): void {
    this.getBalance();
    this.getCards();
    this.getPayments();
  }

  getBalance(): void {
    this.balanceSvc.getCurrentBalance()
      .then( bal => {
        if (!bal) {
          bal = 0;
        }
        // bal is a number representing 1/10000ths of a cent
        this.balance = '$' + (bal / 1000000).toFixed(2);
      }).catch(e => {
      console.log(e);
    });
  }

  getCards(): void {
    this.balanceSvc.getSavedCards()
      .then(cards => {
        this.cards = cards;
      }).catch(e => {
      console.log(e);
    });
  }

  getPayments(): void {
    this.balanceSvc.getAdjustments()
      .then(adjustments => {
        this.adjustments = adjustments;
      }).catch(e => {
        console.log(e);
    });
  }

  async stripeCheckout() {
    const stripe = await this.stripePromise;
    const response = await this.balanceSvc.getStripeCheckoutSession( this.creditAmount  * 100);
    const result = await stripe.redirectToCheckout({
      sessionId: response,
    });
    if (result.error) {
      // TODO display this error to customer
      console.log(result.error.message);
    }
  }

  async chargeCard() {
    const card = this.cardForm.value as Card;
    const amt = this.creditAmount;
    this.creditAmount = null;
    const clientSec = await this.balanceSvc.chargeCard(card.id, amt * 100);

    if (clientSec && clientSec.length > 0) {
      const stripe = await this.stripePromise;
      const res = await stripe.confirmCardPayment(clientSec);
      if (res.error) {
        this.successMessage = res.error.message;
        return;
      }
    }
    setTimeout(() => {
        this.getBalance();
        this.getPayments();
      }, 3000
    );
    this.successMessage = 'Successfully added $' + amt;
  }

  async deleteCard(card: Card) {
    if (!confirm('Are you sure you want to delete card ending "' + card.last_four + '"')) {
      return;
    }
    await this.balanceSvc.deleteCard(card.id);
    this.getCards();
  }

  async viewReceipt(adjustment: Adjustment) {
    window.open(adjustment.meta.receipt_url, '_blank');
  }

}
