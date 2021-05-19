import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  email: string = "";
  password: string = "";
  verifySent = false;
  verificationCode: string = "";
  loading = false;

  constructor(
    private us: UserService,
    private router: Router,
    private notif: ToastrService
  ) {

  }

  ngOnInit() {}

  sendVerificationEmail() {
    this.loading = true
    this.us
      .sendVerification(this.email)
      .then(() => {
        this.verifySent = true;
      })
      .catch((e) => {
        this.notif.error(e.error.Detail);
      }).finally(() => {
        this.loading = false
      });
  }

  verify() {
    this.loading = true
    this.us
      .verify(this.email, this.password, this.verificationCode)
      .then(() => {
        document.location.href = "/";
      })
      .catch((e) => {
        this.notif.error(e.error.Detail);
      }).finally(() => {
        this.loading = false
      });;
  }
}
