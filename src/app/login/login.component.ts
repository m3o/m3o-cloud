import { Component, OnInit, HostListener } from "@angular/core";
import { UserService } from "../user.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";
  namespace: string = "micro";

  constructor(
    private us: UserService,
    private router: Router,
    private notif: ToastrService
  ) {}

  ngOnInit() {
    if (this.us.refreshToken() != "") {
      this.router.navigate(["/"]);
      return;
    }
  }

  public githubLogin(event: any) {
    this.us.logout();
    document.location.href = environment.apiUrl + "/signup/githubLogin";
    return false;
  }

  public login() {
    this.us
      .login(this.email, this.password, this.namespace)
      .then(() => {
        document.location.href = "/";
      })
      .catch((e) => {
        console.log(e);
        this.notif.error(e.error.Detail);
      });
    return false;
  }
}
