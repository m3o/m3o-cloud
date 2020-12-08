import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ServiceService } from "../service.service";
import { RuntimeService } from "../runtime.service";
import * as types from "../types";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import * as _ from "lodash";
import { NotificationsService } from "angular2-notifications";

const tabNamesToIndex = {
  "": 0,
  logs: 1,
  stats: 2,
  nodes: 3,
  traces: 4,
  events: 5,
};

const tabIndexesToName = {
  0: "",
  1: "logs",
  2: "stats",
  3: "nodes",
  4: "traces",
  5: "events",
};

@Component({
  selector: "app-service",
  templateUrl: "./status-single.component.html",
  styleUrls: [
    "./status-single.component.css",
    "../../../node_modules/nvd3/build/nv.d3.css",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class StatusSingleComponent implements OnInit {
  service: types.Service = {} as types.Service;
  version = "";

  services: types.Service[];
  log: string = "";
  stats: types.DebugSnapshot[] = [];
  traceSpans: types.Span[];
  events: types.Event[];

  serviceName: string;
  endpointQuery: string;
  intervalId: any;
  // refresh stats
  refresh = true;
  refreshLogs = true;

  selected = 0;
  tabValueChange = new Subject<number>();

  constructor(
    private ses: ServiceService,
    private rs: RuntimeService,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private notif: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {
    var that: StatusSingleComponent = this;
    this.activeRoute.params.subscribe((p) => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.serviceName = <string>p["id"];
      this.version = <string>p["version"];

      this.rs.list().then((servs) => {
        this.services = servs.filter(
          (s) => s.name == this.serviceName && s.version == this.version
        );
        this.service = this.services[0];
      });
      this.loadVersionData();
      const tab = <string>p["tab"];

      this.rs.logs(this.serviceName).then(function (response) {
        let reader = response.body.getReader();
        let decoder = new TextDecoder();
        return readData();
        function readData() {
          return reader.read().then(function ({ value, done }) {
            let newData = decoder.decode(value, { stream: !done });
            if (that.log.length > 10000) {
              that.log = "";
            }
            that.log += newData + "\n";
            if (done) {
              console.log("Stream complete");
              return;
            }
            return readData();
          });
        }
      });
      if (tab) {
        this.selected = tabNamesToIndex[tab];
      }
    });
  }

  public hasError(ss: types.Service): boolean {
    return ss.metadata["error"] != undefined;
  }

  loadVersionData() {
    // stats subscriptions
    let statsFailure = false;
    this.intervalId = setInterval(() => {
      if (this.selected !== 2 || !this.refresh) {
        return;
      }
      this.ses
        .stats(this.serviceName)
        .then((stats) => {
          this.stats = [].concat(this.stats, stats);
        })
        .catch((e) => {
          if (statsFailure) {
            return;
          }
          statsFailure = true;
          this.notif.error("Error reading stats", e);
        });
    }, 2000);
    this.tabValueChange.subscribe((index) => {
      if (index !== 1 || !this.refresh) {
        return;
      }
    });
  }

  tabChange($event: number) {
    this.selected = $event;
    this.location.replaceState(
      "/status/" +
        this.serviceName +
        "/" +
        this.version +
        "/" +
        tabIndexesToName[this.selected]
    );
    this.tabValueChange.next(this.selected);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  remove() {
    if (
      confirm(
        "Are you sure you want to delete service " +
          this.service.name +
          " and version " +
          this.service.version +
          "?"
      )
    ) {
      this.rs
        .delete(this.service.name, this.service.version)
        .then(() => {
          setTimeout(() => {
            this.router.navigate(["/status"]);
          }, 1500);
        })
        .catch((e) => {
          this.notif.error(e);
        });
    }
  }

  code: string = "{}";

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
