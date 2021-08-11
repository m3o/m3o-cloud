import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchText = '';

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.searchText = params.get('q') || '';
  }
}
