import { Component, OnInit } from '@angular/core';
import { ExploreService, API, ExploreAPI } from '../explore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const STATE_KEY_SEARCH = makeStateKey('search');

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  constructor(
    public exp: ExploreService,
    private route: ActivatedRoute,
    private router: Router,
    private state: TransferState
  ) {}

  search: string;
  services: ExploreAPI[];
  results: ExploreAPI[];
  timeout: any = null;
  loading = false;

  ngOnInit(): void {
    let services: ExploreAPI[] = this.state.get(STATE_KEY_SEARCH, <any> []);
    if (services.length == 0) {
      this.loading = true
      this.route.queryParams.subscribe((params) => {
        this.search = params['q'];
        this.searchResults().finally(() => {
          this.state.set(STATE_KEY_SEARCH, <any> this.services)
        });
      });
    } else {
      this.services = services
    }
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.searchResults();
    }
  }

  searchResults(): Promise<void> {
    this.loading = true;
    return this.exp.search(this.search)
      .then((ss) => {
        this.services = ss.filter((s) => s.description);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
