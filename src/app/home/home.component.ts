import { Component, OnInit } from '@angular/core';
import { stubTrue } from 'lodash';
import { ExploreService, Service } from '../explore.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public exp: ExploreService) {}

  search: string;
  services: Service[];
  results: Service[];
  timeout: any = null;
  loading = true;

  ngOnInit() {
    this.exp.search().then((ss) => {
      this.services = ss.filter((s) => s.readme);
      this.loading = false;
    });
  }

  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeListing(event.target.value);
      }
    }, 1000);
  }

  private executeListing(value: string) {
    this.loading = true
    this.searchResults()
  } 

  searchResults() {
    this.exp.search(this.search).then((ss) => {
      this.services = ss.filter((s) => s.readme);
      this.loading = false
    });
  }

  readme(s: Service): string {
    const length = 80
    if (!s.readme) {
      return '';
    }
    var lines = s.readme.split('\n');
    if (
      lines.length > 1 &&
      lines[0].toLocaleLowerCase().startsWith('# ' + s.service.name)
    ) {
      return lines
        .slice(1)
        .filter((line) => !line.startsWith('#'))
        .join('\n')
        .slice(0, length) + "...";
    }
    return s.readme.slice(0, length) + "...";
  }
}
