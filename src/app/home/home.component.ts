import { Component, OnInit } from '@angular/core';
import { stubTrue } from 'lodash';
import { ExploreService, API, ExploreAPI } from '../explore.service';
import { Router } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';

const STATE_KEY_HOME = makeStateKey('home');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor(
    public exp: ExploreService,
    private router: Router,
    private state: TransferState,
  ) {}

  search: string;
  services: ExploreAPI[];
  results: ExploreAPI[];
  timeout: any = null;
  loading = false;

  ngOnInit() {
    let services: ExploreAPI[] = this.state.get(STATE_KEY_HOME, <any>[]);
    if (services.length == 0) {
      this.loading = true;
      this.exp
        .index(6)
        .then((ss) => {
          this.services = ss.filter((s) => s.description);
          this.state.set(STATE_KEY_HOME, <any>this.services);
        })
        .finally(() => {
          this.loading = false;
        });
    } else {
      this.services = services;
    }
  }
}
