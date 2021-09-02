import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-api-page-navigation',
  templateUrl: './api-page-navigation.component.html',
})
export class ApiPageNavigationComponent implements OnInit {
  constructor(private modalService: ModalService) {}

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
      pathname: 'console',
    },
  ];

  sideButtons = [
    {
      name: 'Downloads',
      onClick: () => this.modalService.openModal('downloads'),
    },
    // {
    //   name: 'Share',
    //   onClick: this.alert,
    // },
    // {
    //   name: 'Add to favourites',
    //   onClick: this.alert,
    // },
  ];

  ngOnInit(): void {}

  alert() {
    alert('clicked');
  }
}
