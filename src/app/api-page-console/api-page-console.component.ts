import { Component, OnInit } from '@angular/core';
import {
  getEndpointNameFromApiEndpoint,
  splitEndpointTitle,
} from 'src/utils/api';
import { SingleApiService } from '../single-api.service';

@Component({
  selector: 'app-api-page-console',
  templateUrl: './api-page-console.component.html',
})
export class ApiPageConsoleComponent implements OnInit {
  currentEndpoint = '';

  currentExample = '';

  examples = {};

  // Think this can go
  endpointQuery = '';

  constructor(public singleApiService: SingleApiService) {}

  ngOnInit(): void {
    const {
      api: { examples_json },
      summary: { endpoints },
    } = this.singleApiService.service;

    this.examples = examples_json ? JSON.parse(examples_json) : {};
    this.currentEndpoint = endpoints[0].name;
  }

  formatEndpointName(endpointName: string): string {
    return splitEndpointTitle(getEndpointNameFromApiEndpoint(endpointName));
  }

  getEndpointExamples(endpointName: string): any[] {
    const str = getEndpointNameFromApiEndpoint(endpointName).toLowerCase();
    return this.examples[str] || [];
  }

  onExampleClick(endpointName: string, exampleName: string): void {
    this.currentEndpoint = endpointName;
    this.currentExample = exampleName;
  }
}
