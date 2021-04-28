import { Component, OnInit } from '@angular/core';
import { ExploreService, Service } from '../explore.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
})
export class SearchPageComponent implements OnInit {
  constructor(public exp: ExploreService, private route: ActivatedRoute, private router: Router) {}

  search: string;
  services: Service[];
  results: Service[];
  timeout: any = null;
  loading = true;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['q'];
      this.searchResults();
    });
  }

  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      $this.router.navigate(['.'], { relativeTo: $this.route, queryParams: { q: $this.search }});
      $this.executeListing(event.target.value);
    }, 1000);
  }

  private executeListing(value: string) {
    this.loading = true;
    this.searchResults();
  }

  searchResults() {
    this.exp.search(this.search).then((ss) => {
      this.services = ss.filter((s) => s.readme);
      this.loading = false;
    });
  }
}
