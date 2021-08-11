import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-link-button',
  templateUrl: './link-button.component.html',
})
export class LinkButtonComponent implements OnInit {
  @Input() href = '';

  constructor() {}

  ngOnInit(): void {}
}
