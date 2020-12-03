import { Component, OnInit } from "@angular/core";
import { RuntimeService } from "../runtime.service";
import * as types from "../types";
import { NotificationsService } from "angular2-notifications";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

@Component({
  selector: "app-services",
  templateUrl: "./status.component.html",
  styleUrls: ["./status.component.scss"],
})
export class StatusComponent implements OnInit {
  services: Map<string, types.Service[]>;
  query: string;

  constructor(
    private rus: RuntimeService,
    private notif: NotificationsService
  ) {}

  ngOnInit() {
    this.rus
      .list()
      .then((servs) => {
        this.services = groupBy(servs, "name");
      })
      .catch((e) => {
        console.log(e);
        this.notif.error(
          "Error listing services",
          JSON.parse(e.error.error).detail
        );
      });
  }

  hasError(ss: types.Service[]): boolean {
    return (
      ss.filter((s) => {
        return s.metadata["error"] != undefined;
      }).length > 0
    );
  }
}
