import { Component, OnInit, Input } from '@angular/core';
import {ExploreService, API, ExploreAPI} from '../explore.service';

@Component({
  selector: 'app-search-result-grid',
  templateUrl: './search-result-grid.component.html',
  styleUrls: ['./search-result-grid.component.css'],
})
export class SearchResultGridComponent implements OnInit {
  @Input() services: ExploreAPI[];

  constructor() {}

  ngOnInit(): void {}

  readme(s: ExploreAPI): string {
    const length = 80;
    if (!s.api.description) {
      return '';
    }
    var lines = s.api.description.split('\n');
    if (
      lines.length > 1 &&
      lines[0].toLocaleLowerCase().startsWith('# ' + s.detail.name)
    ) {
      return lines
        .slice(1)
        .filter((line) => !line.startsWith('#'))
        .join('\n')
        .slice(0, length);
    }
    return s.api.description.slice(0, length);
  }
}
