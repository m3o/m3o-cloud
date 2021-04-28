import { Component, OnInit, Input } from '@angular/core';
import { ExploreService, Service } from '../explore.service';

@Component({
  selector: 'app-search-result-grid',
  templateUrl: './search-result-grid.component.html',
  styleUrls: ['./search-result-grid.component.css'],
})
export class SearchResultGridComponent implements OnInit {
  @Input() services: Service[];

  constructor() {}

  ngOnInit(): void {}

  readme(s: Service): string {
    const length = 50;
    if (!s.readme) {
      return '';
    }
    var lines = s.readme.split('\n');
    if (
      lines.length > 1 &&
      lines[0].toLocaleLowerCase().startsWith('# ' + s.service.name)
    ) {
      return (
        lines
          .slice(1)
          .filter((line) => !line.startsWith('#'))
          .join('\n')
          .slice(0, length) + '...'
      );
    }
    return s.readme.slice(0, length) + '...';
  }
}
