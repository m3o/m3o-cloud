import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';
import { splitEndpointTitle } from 'src/utils/api';
import { SingleApiService } from '../single-api.service';

interface ApiMethodExample {
  request: Record<string, any>;
  response: Record<string, any>;
  title: string;
}

interface Item {
  key: string;
  value: ApiMethodExample[];
}

interface ParsedExamples {
  [key: string]: Array<ApiMethodExample>;
}

@Component({
  selector: 'app-method-card',
  templateUrl: './method-card.component.html',
})
export class MethodCardComponent implements OnInit {
  @Input() title = '';
  @Input() responseSchema: SchemaObject | undefined;
  @Input() requestSchema: SchemaObject | undefined;
  @Input() item: any;
  @Input() apiName: string;
  @Input() pricing: string;
  @Input() examples: ParsedExamples;

  constructor(private singleApiService: SingleApiService) {}

  ngOnInit(): void {
    const test = this.pathResponseIsStream();
    console.log({ test });
  }

  formatTitle(): string {
    return splitEndpointTitle(this.title);
  }

  pathResponseIsStream() {
    const { openApi } = this.singleApiService.returnParsedContent();
    const key = `/${this.apiName}/${this.item.name.replace('.', '/')}`;
    const path = openApi.paths[key];

    if (
      path === undefined ||
      path.post === undefined ||
      path.post.responses === undefined
    ) {
      return false;
    }

    if (path.post.responses['stream'] != undefined) {
      return true;
    }

    return false;
  }
}
