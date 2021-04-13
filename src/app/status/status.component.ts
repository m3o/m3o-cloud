import { Component, OnInit } from "@angular/core";
import { RuntimeService } from "../runtime.service";
import { UserService } from "../user.service";
import * as types from "../types";
import { ToastrService } from 'ngx-toastr';

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
    private notif: ToastrService
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
      return "you";
    }
    return name;
  }

  toStatus(n: number) {
    switch (n) {
      case 1:
        return "pending";
      case 2:
        return "building";
      case 3:
        return "starting";
      case 4:
        return "running";
      case 5:
        return "stopping";
      case 6:
        return "stopped";
      case 7:
        return "error";
      default:
        return "unknown";
    }
  }
}
