import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as types from '../types';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.css'],
})
export class GettingStartedComponent implements OnInit {
  public user: types.Account;
  code = `// npm install --save @m3o/m3o-node 
const m3o = require('@m3o/m3o-node');
  
new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE' })
  .call('helloworld', 'Call', {
    "name": "Albert"
})
.then((response) => {
  console.log(response);
  // response is {"message": "Hello Albert!"}
});`;

  revealed = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;

    this.userService.isUserLoggedIn.subscribe(() => {
      this.user = this.userService.user;
    });
  }

  reveal() {
    this.userService.v1ApiToken().then((token) => {
      this.code = this.code.replace('INSERT_YOUR_YOUR_M3O_TOKEN_HERE', token);
      this.revealed = true;
    });
  }

  hide() {
    this.userService.v1ApiToken().then((token) => {
      this.code = this.code.replace(token, 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE');
      this.revealed = false
    });
  }
}
