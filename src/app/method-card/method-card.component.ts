import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';

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

  constructor() {}

  ngOnInit(): void {
    console.log('this.item', this.item, this.responseSchema);
  }

  getResponseCode() {
    return JSON.stringify(this.item.value[0].response, null, 2);
  }

  getExampleCode() {
    const { key } = this.item;

    return `import m3o from '@m3o/m3o-node';

const client = new m3o.Client({ token: 'YOUR_M3O_API_KEY' });

client.call('${this.apiName}', '${key}', ${JSON.stringify(
      this.item.value[0].request,
      null,
      2,
    )})
  .then(response => {
    console.log(response);
  });`;
  }
}
