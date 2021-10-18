import { Component, OnInit } from '@angular/core';
import { PricingService, PricingItem } from '../pricing.service';
import {
  getEndpointNameFromApiEndpoint,
  splitEndpointTitle,
} from '../../utils/api';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements OnInit {
  constructor(public pricingService: PricingService) {}

  paidItems: PricingItem[] = [];

  ngOnInit(): void {
    this.pricingService.fetchResults().then(() => {
      this.paidItems = this.pricingService.getPaidResults();
    });
  }

  formatPricing(price: string): string {
    return price === '0' ? 'Free' : `$${parseInt(price, 10) / 1000000}`;
  }

  formatEndpointName(name: string): string {
    return splitEndpointTitle(getEndpointNameFromApiEndpoint(name));
  }
}
