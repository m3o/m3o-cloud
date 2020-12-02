import { Component, OnInit, HostListener } from "@angular/core";
import { UserService } from "../user.service";
import { environment } from "../../environments/environment";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  password: string = "";

  constructor(private us: UserService, private router: Router) {}

  ngOnInit() {}

  public githubLogin(event: any) {
    this.us.logout();
    document.location.href = environment.apiUrl + "/signup/githubLogin";
    return false;
  }

  public login() {
    this.us.login(this.email, this.password).then(() => {
      this.router.navigate(["/services"]);
    });
    return false;
  }
}
