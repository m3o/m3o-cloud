import { Component, OnInit, HostListener } from '@angular/core';
import { UserService } from '../user.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  namespace: string = 'micro';
  loading = false;

  constructor(
    private us: UserService,
    private router: Router,
    private notif: ToastrService,
  ) {}

  ngOnInit() {}

  public githubLogin(event: any) {
    this.us.logout();
    document.location.href = environment.apiUrl + '/signup/githubLogin';
    return false;
  }

  public login() {
    console.log(this.email);
    if (!this.email || !this.password) return;

    this.loading = true;

    this.us
      .login(this.email, this.password, this.namespace)
      .then(() => {
        document.location.href = '/explore';
      })
      .catch((e) => {
        console.log(e);
        this.notif.error(e.error.Detail);
      })
      .finally(() => {
        this.loading = false;
      });
    return false;
  }

  public google() {
    this.us.googleOauthURL().then((url) => {
      document.location.href = url;
    });
  }

  public github() {
    this.us.githubOauthURL().then((url) => {
      document.location.href = url;
    });
  }
}
