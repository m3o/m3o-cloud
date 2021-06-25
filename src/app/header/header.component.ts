import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import * as types from '../types';
import * as uuid from 'uuid';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(private cs: CookieService, private us: UserService) {}

  ngOnInit() {
    let firstVisit = this.cs.get('first_visit');
    console.log(firstVisit)
    if (!firstVisit) {
      alert("wha")
      let fvisit = Math.floor(Date.now() / 1000);
      let id = uuid.v4();
      this.cs.set('tr_id', id, 365, '/', null, null, null);
      this.cs.set('first_visit', fvisit + '', 365, '/', null, null, null);
      this.us.track({ id: id, firstVisit: fvisit });
    }
  }
}
