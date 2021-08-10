import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute, public us: UserService) { }
  code: string;
  state: string;
  errorReason: string;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((queryParams) => {

      if (queryParams.get('code')) {
        this.code = queryParams.get('code')
      }

      if (queryParams.get('state')) {
        this.state = queryParams.get('state')
      }

      if (queryParams.get('error_reason')) {
        this.errorReason = queryParams.get('error_reason')
      }

      if (this.code) {
        this.us.googleOauthCallback(this.code, this.state, this.errorReason)
      }
    });
  }

}
