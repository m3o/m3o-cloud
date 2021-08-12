import { Component, OnInit, Input } from '@angular/core';
import { ExploreService, API, ExploreAPI } from '../explore.service';

@Component({
  selector: 'app-search-result-grid',
  templateUrl: './search-result-grid.component.html',
})
export class SearchResultGridComponent implements OnInit {
  @Input() services: ExploreAPI[];

  constructor() {}

  ngOnInit(): void {}

  formatName(name: string): string {
    if (name === '') {
      return '';
    }

    return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

  readme(s: ExploreAPI): string {
    const length = 80;
    if (!s.description) {
      return '';
    }
    var lines = s.description.split('\n');
    if (
      lines.length > 1 &&
      lines[0].toLocaleLowerCase().startsWith('# ' + s.name)
    ) {
      return lines
        .slice(1)
        .filter((line) => !line.startsWith('#'))
        .join('\n')
        .slice(0, length);
    }

    return lines[0].slice(0, length);
  }
}
