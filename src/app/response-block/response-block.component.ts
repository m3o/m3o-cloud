import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';
import { schemaToJSON } from 'src/utils/api';

@Component({
  selector: 'app-response-block',
  templateUrl: './response-block.component.html',
})
export class ResponseBlockComponent implements OnInit {
  @Input() responseSchema: SchemaObject = {};

  code = '';

  constructor() {}

  ngOnInit(): void {
    this.code = schemaToJSON(this.responseSchema);
  }
}
