import { Component, Input, OnInit, ElementRef } from '@angular/core';
import * as openapi from 'openapi3-ts';

@Component({
  selector: '[app-property-lister]',
  templateUrl: './property-lister.component.html',
  styleUrls: ['./property-lister.component.css'],
})
export class PropertyListerComponent implements OnInit {
  @Input() schema: openapi.SchemaObject;
  @Input() level: number = 0;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    var nativeElement: HTMLElement = this.el.nativeElement,
      parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    // remove the empty element(the host)
    parentElement.removeChild(nativeElement);
  }

  prefix(): string {
    return '---'.repeat(this.level) + ' ';
  }
}
