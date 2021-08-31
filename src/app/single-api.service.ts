import { Injectable } from '@angular/core';
import { API, ExploreService } from './explore.service';

@Injectable({
  providedIn: 'root',
})
export class SingleApiService {
  service: API;

  constructor(private exploreService: ExploreService) {}

  async loadService(serviceName: string) {
    try {
      this.service = await this.exploreService.service(serviceName);
      console.log(this.service);
    } catch (e) {
      console.log(e);
    }
  }

  reset() {
    this.service = undefined;
  }
}
