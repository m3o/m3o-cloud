import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchText = '';

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      const params = new URLSearchParams(window.location.search);
      this.searchText = params.get('q') || '';
    }
  }
}
