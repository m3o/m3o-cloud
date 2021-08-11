import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  constructor(public searchService: SearchService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    this.router.navigate(['/explore'], {
      queryParams: {
        q: this.searchService.searchText,
      },
    });
  }
}
