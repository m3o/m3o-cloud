import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';

@Component({
  selector: 'app-attributes-list',
  templateUrl: './attributes-list.component.html',
  styleUrls: ['./attributes-list.component.css'],
})
export class AttributesListComponent implements OnInit {
  open = false;

  @Input() item: SchemaObject;

  constructor() {}

  ngOnInit(): void {}

  returnItems(items: any) {
    // Weird angular business
    return items.properties;
  }

  shouldShowButton(): boolean {
    if (this.item.type === 'array') return true;
    return !!Object.keys(this.item.properties || {}).length;
  }
}
