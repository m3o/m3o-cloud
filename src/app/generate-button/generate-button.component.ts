import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-generate-button',
  templateUrl: './generate-button.component.html',
  styleUrls: ['./generate-button.component.css'],
})
export class GenerateButtonComponent implements OnInit {
  constructor(private router: Router, private us: UserService) {}

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
