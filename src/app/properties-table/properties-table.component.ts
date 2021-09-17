import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';

interface Properties {
  [key: string]: SchemaObject;
}

@Component({
  selector: 'app-properties-table',
  templateUrl: './properties-table.component.html',
})
export class PropertiesTableComponent implements OnInit {
  @Input() title = '';

  @Input() properties: Properties;

  constructor() {}

  ngOnInit(): void {}

  hasKeys(obj: object): boolean {
    return !!Object.keys(obj).length;
  }
}
