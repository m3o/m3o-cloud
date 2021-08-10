import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {
  constructor() {}

  search = '';

  @Output() onSubmit = new EventEmitter<string>();

  ngOnInit(): void {}
}
