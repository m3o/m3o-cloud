import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent implements OnInit {
  private isOpen = false;

  constructor() {}

  ngOnInit(): void {}

  test() {
    this.isOpen = !this.isOpen;
  }
}
