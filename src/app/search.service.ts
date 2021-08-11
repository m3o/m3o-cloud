import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { ExploreAPI, ExploreService } from './explore.service';

const STATE_KEY_SEARCH = makeStateKey('search');

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  loadingResults = false;

  searchText = '';

  results: ExploreAPI[] = [];

  constructor(
    private transferState: TransferState,
    public exploreService: ExploreService,
  ) {
    this.results = this.transferState.get<ExploreAPI[]>(STATE_KEY_SEARCH, []);
  }

  async fetchResults(): Promise<void> {
    this.loadingResults = true;

    try {
      const results = (await this.exploreService.search(this.searchText)) || [];
      this.results = results.filter((service) => service.description);
    } catch (e) {
    } finally {
      this.loadingResults = false;
      this.transferState.set<ExploreAPI[]>(STATE_KEY_SEARCH, this.results);
    }
  }
}
