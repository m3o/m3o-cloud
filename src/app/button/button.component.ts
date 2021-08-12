import { Component, OnInit, Input } from '@angular/core';

type ButtonTypes = 'submit' | 'button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent implements OnInit {
  @Input() type: ButtonTypes = 'button';
  @Input() loading = false;

  constructor() {}

  ngOnInit(): void {}
}
