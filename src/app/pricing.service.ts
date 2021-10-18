import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

export interface PricingItem {
  display_name: string;
  icon: string;
  id: string;
  name: string;
  pricing: {
    [key: string]: string;
  };
}

interface FetchResultsResponse {
  prices: PricingItem[];
}

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  results: FetchResultsResponse['prices'] = [];

  constructor(private http: HttpClient) {}

  async fetchResults(): Promise<void> {
    try {
      const response = await this.http
        .post<FetchResultsResponse>(
          `${environment.apiUrl}/publicapi/explore/Pricing`,
          {},
        )
        .toPromise();

      this.results = response.prices;
    } catch (e) {}
  }

  getFreeResults(): PricingItem[] {
    return this.results.filter(
      (item) =>
        !Object.keys(item.pricing).filter((key) => item.pricing[key] !== '0')
          .length,
    );
  }

  getPaidResults(): PricingItem[] {
    return this.results.filter((item) =>
      Object.keys(item.pricing).some((key) => item.pricing[key] !== '0'),
    );
  }
}
