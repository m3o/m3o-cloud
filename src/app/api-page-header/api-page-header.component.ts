import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SingleApiService } from '../single-api.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-api-page-header',
  templateUrl: './api-page-header.component.html',
})
export class ApiPageHeaderComponent implements OnInit {
  constructor(
    public singleApiService: SingleApiService,
    private us: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onGenerateClick() {
    const isNotLoggedIn =
      !this.us.loggedIn() || !this.us.user || !this.us.user.name;

    if (isNotLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/settings/keys']);
    }
  }
}
