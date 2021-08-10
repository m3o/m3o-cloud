import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();

  @Input() isLoggedIn = false;

  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  onLogout() {
    this.onClose.emit();
    this.userService.logout();
  }
}
