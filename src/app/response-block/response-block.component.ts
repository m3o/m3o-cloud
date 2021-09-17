import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';
import { schemaToJSON } from 'src/utils/api';
import * as types from '../types';

import {
  requestToCurl,
  ExampleArguments,
  requestToGo,
  requestToNode,
} from 'src/utils/api';

@Component({
  selector: 'app-response-block',
  templateUrl: './response-block.component.html',
})
export class ResponseBlockComponent implements OnInit {
  @Input() responseSchema: SchemaObject = {};
  @Input() examples: types.ParsedExamples;

  code = '';

  constructor() {}

  ngOnInit(): void {
    try {
      let path = this.responseSchema.title.replace('Response', '');

      this.code = JSON.stringify(
        this.examples[path.toLowerCase()][0].response,
        null,
        ' ',
      );
    } catch (e) {
      this.code = schemaToJSON(this.responseSchema);
    }
  }
}
