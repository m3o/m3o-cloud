import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';
import { splitEndpointTitle } from 'src/utils/api';

interface ApiMethodExample {
  request: Record<string, any>;
  response: Record<string, any>;
  title: string;
}

interface Item {
  key: string;
  value: ApiMethodExample[];
}

@Component({
  selector: 'app-method-card',
  templateUrl: './method-card.component.html',
})
export class MethodCardComponent implements OnInit {
  @Input() title = '';
  @Input() responseSchema: SchemaObject | undefined;
  @Input() requestSchema: SchemaObject | undefined;
  @Input() item: Item;
  @Input() apiName: string;
  @Input() pricing: string;

  constructor() {}

  ngOnInit(): void {}

  formatTitle(): string {
    return splitEndpointTitle(this.title);
  }
}
