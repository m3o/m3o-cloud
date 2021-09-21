import { Component, OnInit } from '@angular/core';
import { schemaToJSON } from 'src/utils/api';
import { SingleApiService, FormattedEndpoints } from '../single-api.service';
import { splitEndpointTitle } from 'src/utils/api';

@Component({
  selector: 'app-api-page-overview',
  templateUrl: './api-page-overview.component.html',
})
export class ApiPageOverviewComponent implements OnInit {
  endpoints: FormattedEndpoints;
  example = undefined;

  exampleCode = '';

  constructor(public singleApiService: SingleApiService) {}

  ngOnInit(): void {
    this.setExampleCode();
  }

  setExampleCode(): void {
    this.endpoints = this.singleApiService.returnFormattedEndpoints();

    const [firstKey] = Object.keys(this.endpoints);
    this.exampleCode = `import m3o from '@m3o/m3o-node';

const client = new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_API_KEY_HERE' });

client.call('${
      this.singleApiService.service.api.name
    }', '${firstKey}', ${schemaToJSON(this.endpoints[firstKey].request)})
  .then(response => {
    console.log(response);
  });`;

    for (let key in this.endpoints) {
      let value = this.endpoints[key];
      if (value['examples'] != undefined && value['examples'].length > 0) {
        this.example = value['examples'][0];
        console.log(this.example);
        return;
      }
    }
  }

  formatJSON(val: any): string {
    return JSON.stringify(val, null, 4);
  }

  formatTitle(name: string): string {
    return splitEndpointTitle(name);
  }

  getDescription(): string {
    const {
      service: {
        api: { description },
      },
    } = this.singleApiService;

    const [, desc] = description.split('Service');
    return desc.replace('\n', ' ');
  }

  getFirstEndpointName(): string {
    const [firstKey] = Object.keys(this.endpoints);
    return firstKey;
  }

  getEndpointPrice(endpoint: any) {
    let price: string = 'Free';
    const { pricing = {} } = this.singleApiService.service.api;

    Object.keys(pricing).forEach((key) => {
      if (key.includes(endpoint.key)) {
        price = `$${parseInt(pricing[key]) / 1000000}`;
      }
    });

    return price;
  }
}
