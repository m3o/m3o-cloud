import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Location } from "@angular/common";
import { UserService } from "../user.service";
import { ServiceService } from "../service.service";
import * as types from "../types";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import * as rxjs from "rxjs";
import { debounceTime } from "rxjs/operators";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: "app-new-service",
  templateUrl: "./new-service.component.html",
  styleUrls: ["./new-service.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class NewServiceComponent implements OnInit {
  serviceInput = new FormControl("", [Validators.required]);
  @ViewChild("sinput", { static: false }) sinput: ElementRef;

  source = "github.com/micro/services/helloworld";
  serviceName = "";
  deploying = false;

  constructor(
    private us: UserService,
    private ses: ServiceService,
    private router: Router,
    private location: Location,
    private activeRoute: ActivatedRoute,
    private notif: NotificationsService
  ) {}

  ngOnInit() {}

  deploy() {
    this.deploying = true;
    if (!this.serviceName) {
      this.notif.error("Service name required", "Please specify it.");
      this.deploying = false;
      return false;
    }
    this.ses
      .create(this.serviceName, this.source)
      .then((v) => {
        setTimeout(() => {
          this.router.navigate(["/services"]);
        }, 1500);
      })
      .catch((e) => {
        this.notif.error(e);
        this.deploying = false;
      });
  }
}
