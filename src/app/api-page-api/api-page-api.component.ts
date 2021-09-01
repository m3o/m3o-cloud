import { Component, OnInit } from '@angular/core';
import { OpenAPIObject, SchemaObject } from 'openapi3-ts';
import { getPrice } from 'src/utils/api';
import { SingleApiService } from '../single-api.service';

type ApiMethodExample = {
  request: Record<string, any>;
  response: Record<string, any>;
  title: string;
};

interface ParsedExamples {
  [key: string]: Array<ApiMethodExample>;
}

@Component({
  selector: 'app-api-page-api',
  templateUrl: './api-page-api.component.html',
})
export class ApiPageApiComponent implements OnInit {
  parsedExamples: ParsedExamples;

  openApiObject: OpenAPIObject;

  constructor(public singleApiService: SingleApiService) {}

  ngOnInit(): void {
    const {
      service: { api },
    } = this.singleApiService;

    this.parsedExamples = api.examples_json
      ? JSON.parse(api.examples_json)
      : {};

    this.openApiObject = JSON.parse(api.open_api_json);
  }

  capitalizeKey(key: string): string {
    return key.replace(/\b\w/g, (l) => l.toUpperCase());
  }

  returnSchema(
    key: string,
    method: 'Request' | 'Response',
  ): SchemaObject | undefined {
    const { components } = this.openApiObject;

    if (components?.schemas) {
      return components.schemas[`${key}${method}`] as SchemaObject;
    }

    return undefined;
  }

  getResponseSchema(key: string): SchemaObject | undefined {
    const [, test] = key.split('.');
    return this.returnSchema(test, 'Response');
  }

  getRequestSchema(key: string): SchemaObject | undefined {
    const [, test] = key.split('.');
    return this.returnSchema(test, 'Request');
  }

  getMethodPricing(key: string): string {
    const { pricing } = this.singleApiService.service.api;
    return getPrice({ pricing, key });
  }
}
