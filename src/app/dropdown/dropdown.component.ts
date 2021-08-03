import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit {
  @Input() title = '';

  private isOpen = true;

  constructor() {}

  ngOnInit(): void {}

  test() {
    this.isOpen = !this.isOpen;
  }
}
