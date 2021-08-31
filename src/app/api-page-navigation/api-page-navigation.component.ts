import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-page-navigation',
  templateUrl: './api-page-navigation.component.html',
})
export class ApiPageNavigationComponent implements OnInit {
  constructor() {}

  apiNavigationLinks = [
    {
      name: 'Overview',
      pathname: 'overview',
    },
    {
      name: 'API',
      pathname: 'api',
    },
    {
      name: 'Console',
      pathname: 'query',
    },
  ];

  sideButtons = [
    {
      name: 'Downloads',
      onClick: this.alert,
    },
    {
      name: 'Share',
      onClick: this.alert,
    },
    {
      name: 'Add to favourites',
      onClick: this.alert,
    },
  ];

  ngOnInit(): void {}

  alert() {
    alert('clicked');
  }
}
