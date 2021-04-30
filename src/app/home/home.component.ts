import { Component, OnInit } from '@angular/core';
import { stubTrue } from 'lodash';
import { ExploreService, Service } from '../explore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public exp: ExploreService, private router: Router) {}

  search: string;
  services: Service[];
  results: Service[];
  timeout: any = null;
  loading = true;

  ngOnInit() {
    this.exp.index().then((ss) => {
      this.services = ss.filter((s) => s.readme);
      this.loading = false;
    });
  }

  keyDownFunction(event) {
    if (event.keyCode === 13) {
     this.submit()
    }
  }

  submit() {
    this.router.navigate(['/explore'], {
      queryParams: {
        q: this.search,
      },
    });
  }
}
