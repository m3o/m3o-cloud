import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import * as _ from "lodash";
import { NotificationsService } from "angular2-notifications";
import { RuntimeService } from "../runtime.service";

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
    private router: Router,
    private rus: RuntimeService,
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
    this.rus
      .create(this.serviceName, this.source)
      .then((v) => {
        setTimeout(() => {
          this.router.navigate(["/status"]);
        }, 1500);
      })
      .catch((e) => {
        this.notif.error(e);
        this.deploying = false;
      });
  }
}
