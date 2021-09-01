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
      console.log(this.service);
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

  returnFormattedEndpoints(): FormattedEndpoints {
    const { endpoints } = this.service.summary;
    const { openApi } = this.returnParsedContent();

    return endpoints.reduce((obj, { name }) => {
      const [, key] = name.split('.');
      const { components } = openApi;

      if (!components?.schemas) return obj;

      return {
        ...obj,
        [key]: {
          request: components.schemas[`${key}Request`],
          response: components.schemas[`${key}Response`],
        },
      };
    }, {});
  }

  schemaToJSON(schema: SchemaObject): string {
    let recur = (schema: SchemaObject): Object => {
      switch (schema.type as string) {
        case 'object':
          let ret = {};
          for (let key in schema.properties) {
            ret[key] = recur(schema.properties[key]);
          }
          return ret;
        case 'array':
          switch ((schema.items as any).type) {
            case 'object':
              return [recur(schema.items)];
            case 'string':
              return [''];
            case 'int':
            case 'int32':
            case 'int64':
              return [0];
            case 'bool':
              return [false];
          }
        case 'string':
          return '';
        case 'int':
        case 'int32':
        case 'int64':
          return 0;
        case 'bool':
          return false;
        // typescript types below
        case 'number':
          return 0;
        case 'boolean':
          return false;
        default:
          return schema.type;
      }
    };

    return JSON.stringify(recur(schema), null, 2);
  }
}
