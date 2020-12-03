import { Component, OnInit } from "@angular/core";
import { RuntimeService } from "../runtime.service";
import { UserService } from "../user.service";
import * as types from "../types";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: "app-services",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent implements OnInit {
  services: types.Service[];
  query: string;

  constructor(
    private rus: RuntimeService,
    private us: UserService,
    private notif: NotificationsService
  ) {}

  ngOnInit() {
    this.rus
      .list()
      .then((servs) => {
        this.services = servs;
      })
      .catch((e) => {
        console.log(e);
        this.notif.error(
          "Error listing services",
          JSON.parse(e.error.error).detail
        );
      });
  }

  hasError(ss: types.Service): boolean {
    return ss.metadata["error"] != undefined;
  }

  name(name: string): string {
    if (this.us.user.name == name) {
      return 'you'
    }
    return name
  }
}
