import { Component, OnInit } from '@angular/core';
import { schemaToJSON } from 'src/utils/api';
import { SingleApiService, FormattedEndpoints } from '../single-api.service';
import { splitEndpointTitle } from 'src/utils/api';

const REPEATABLE_MICRO_NODE_CODE = `import m3o from '@m3o/m3o-node';

const client = new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_API_KEY_HERE' });

client.call('API_NAME', 'API_METHOD', API_PAYLOAD)
  .then(response => {
    console.log(response);
  });`;

@Component({
  selector: 'app-api-page-overview',
  templateUrl: './api-page-overview.component.html',
})
export class ApiPageOverviewComponent implements OnInit {
  endpoints: FormattedEndpoints;

  repeatableMicroCode = REPEATABLE_MICRO_NODE_CODE;

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
    return desc.replace('\n', ' ').split('Powered')[0];
  }

  getFirstEndpointName(): string {
    const [firstKey] = Object.keys(this.endpoints);
    return firstKey;
  }
}
