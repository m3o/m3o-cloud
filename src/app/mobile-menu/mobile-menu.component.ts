import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
})
export class MobileMenuComponent implements OnInit {
  constructor(public userService: UserService) {}

  @Output() onClose = new EventEmitter<void>();

  ngOnInit(): void {}
}
