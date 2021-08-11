import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

type MenuItem = {
  link: string;
  text: string;
};

@Component({
  selector: 'app-logged-in-dropdown',
  templateUrl: './logged-in-dropdown.component.html',
})
export class LoggedInDropdownComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      link: '/overview/usage',
      text: 'Usage',
    },
    {
      link: '/overview/billing',
      text: 'Billing',
    },
    {
      link: '/settings/keys',
      text: 'API Keys',
    },
  ];

  open = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  togglePopup() {
    this.open = !this.open;
  }
}
