import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { NotificationsService } from "angular2-notifications";

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

  constructor(
    private us: UserService,
    private router: Router,
    private notif: NotificationsService
  ) {
    if (this.us.refreshToken() != "") {
      this.router.navigate(["/services"]);
      return;
    }
  }

  ngOnInit() {}

  sendVerificationEmail() {
    this.us
      .sendVerification(this.email)
      .then(() => {
        this.verifySent = true;
      })
      .catch((e) => {
        this.notif.error(e.error.Detail);
      });
  }

  verify() {
    this.us
      .verify(this.email, this.password, this.verificationCode)
      .then(() => {
        document.location.href = "/services";
      })
      .catch((e) => {
        this.notif.error(e.error.Detail);
      });
  }
}
