import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  email: string = '';
  password: string = '';
  verifySent = false;
  verificationCode: string = '';

  constructor(
    private us: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}

  sendForgotPasswordEmail() {
    this.us
      .sendRecover(this.email)
      .then(() => {
        this.verifySent = true;
      })
      .catch((e) => {
        this.toastr.error(e.error.Detail);
      });
  }

  verify() {
    this.us
      .resetPassword(this.email, this.verificationCode, this.password)
      .then(() => {
        this.router.navigateByUrl("/login")
      })
      .catch((e) => {
        this.toastr.error(e.error.Detail);
      }).then(() => {
        this.toastr.success("Please log in now.", "Successfully reset password");
      });
  }
}
