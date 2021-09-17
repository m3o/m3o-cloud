import { Injectable } from '@angular/core';
import { OpenAPIObject, SchemaObject } from 'openapi3-ts';
import { API, ExploreService } from './explore.service';

export interface FormattedEndpoints {
  [key: string]: {
    request: SchemaObject;
    response: SchemaObject;
  };
}

@Injectable({
  providedIn: 'root',
})
export class SingleApiService {
  service: API;

  constructor(private exploreService: ExploreService) {}

  async loadService(serviceName: string) {
    try {
      this.service = await this.exploreService.service(serviceName);
    } catch (e) {
      console.log(e);
    }
  }

  reset() {
    this.service = undefined;
  }

  returnParsedContent() {
    return {
      examples: this.service.api.examples_json
        ? JSON.parse(this.service.api.examples_json)
        : {},
      openApi: JSON.parse(this.service.api.open_api_json) as OpenAPIObject,
    };
  }

  setService(api: API) {
    this.service = api;
  }

  returnFormattedEndpoints(): FormattedEndpoints {
    const { endpoints } = this.service.summary;
    const { openApi } = this.returnParsedContent();

    return endpoints.reduce((obj, { name }) => {
      const [, key] = name.split('.');
      const { components } = openApi;

      if (!components?.schemas) return obj;

      if (!components.schemas[`${key}Request`]) return obj;

      var ep = key.charAt(0).toLowerCase() + key.slice(1);
      var examples = JSON.parse(this.service.api.examples_json)[ep];
      console.log(examples);
      return {
        ...obj,
        [key]: {
          request: components.schemas[`${key}Request`],
          response: components.schemas[`${key}Response`],
          examples: examples != undefined ? examples : [],
        },
      };
    }, {});
  }
}
