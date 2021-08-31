import { Component, OnInit } from '@angular/core';
import { SingleApiService } from '../single-api.service';

@Component({
  selector: 'app-api-page-overview',
  templateUrl: './api-page-overview.component.html',
})
export class ApiPageOverviewComponent implements OnInit {
  constructor(private singleApiService: SingleApiService) {}

  ngOnInit(): void {
    console.log(this.singleApiService.service);
  }

  getDescription() {
    const {
      service: {
        api: { description },
      },
    } = this.singleApiService;

    const [, desc] = description.split('Service');
    return desc.replace('\n', ' ').split('Powered')[0];
  }
}
