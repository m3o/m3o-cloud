import { Component, OnInit } from '@angular/core';
import { ExploreService, ExploreAPI } from '../explore.service';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
})
export class SearchPageComponent implements OnInit {
  constructor(
    public exp: ExploreService,
    private route: ActivatedRoute,
    public searchService: SearchService,
  ) {}

  search: string;
  services: ExploreAPI[];
  timeout: any = null;
  loading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchService.searchText = params.q;
      this.searchService.fetchResults();
    });
  }
}
