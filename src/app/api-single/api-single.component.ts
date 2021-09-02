import {
  Component,
  OnInit,
  ViewEncapsulation,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import * as types from '../types';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { ExploreService, ExploreAPI, API } from '../explore.service';
import * as openapi from 'openapi3-ts';
import { UserService } from '../user.service';
import { V1ApiService } from '../v1api.service';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { SingleApiService } from '../single-api.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-service',
  templateUrl: './api-single.component.html',
  styleUrls: [
    './api-single.component.css',
    '../../../node_modules/nvd3/build/nv.d3.css',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ApiSingleComponent implements OnInit {
  service: API;
  logs: types.LogRecord[];
  stats: types.DebugSnapshot[] = [];
  traceSpans: types.Span[];
  events: types.Event[];

  selectedVersion = '';
  serviceName: string;
  endpointQuery: string;
  intervalId: any;
  // refresh stats
  refresh = true;
  refreshLogs = true;
  loading = false;

  tabValueChange = new Subject<number>();
  user: types.Account;
  hasKeys = true;
  isBrowser = false;

  constructor(
    private ex: ExploreService,
    private activeRoute: ActivatedRoute,
    public singleApiService: SingleApiService,
    public us: UserService,
    @Inject(PLATFORM_ID) platformId: Object,
    private titleService: Title,
    private metaService: Meta,
    private state: TransferState,
    public modalService: ModalService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.user = this.us.user;

    this.activeRoute.params.subscribe((p) => {
      const serviceName = p.id;

      this.singleApiService.loadService(serviceName);

      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.serviceName = <string>p['id'];
      this.titleService.setTitle(this.serviceName + ' api | Micro');

      this.loadAPI();
    });
  }

  examples = {};

  loadAPI() {
    let processAPI = (serv: API) => {
      this.state.set(makeStateKey('api' + this.serviceName), <any>serv);
      // for (let key in this.openAPI.paths) {
      //   this.showJSON[key] = false;
      // }

      if (this.service.api.examples_json) {
        this.examples = JSON.parse(this.service.api.examples_json);
      }
      this.metaService.addTag({
        name: 'description',
        content: this.firstReadmeLine(),
      });
    };

    let api: API = this.state.get(
      makeStateKey('api' + this.serviceName),
      <any>null,
    );

    if (api == null) {
      this.loading = true;
      this.ex.service(this.serviceName).then((serv) => {
        this.loading = false;
        console.log(serv);
        processAPI(serv);
      });
    } else {
      processAPI(api);
    }
  }

  stringify(a: any): string {
    return JSON.stringify(a, null, ' ');
  }

  firstReadmeLine(): string {
    return this.service.api.description.split('\n').filter((l) => {
      return !l.startsWith('#') && l.length > 5;
    })[0];
  }

  lastPart(s: string): string {
    let ss = s.split('/');
    return ss[ss.length - 1];
  }

  public lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  versionSelected(service: types.Service) {
    if (this.selectedVersion == service.version) {
      this.selectedVersion = '';
      return;
    }
    this.selectedVersion = service.version;
  }

  ngOnDestroy() {
    this.singleApiService.reset();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  code: string = '{}';

  pathIsResponseStream(path: openapi.PathItemObject): boolean {
    if (
      path === undefined ||
      path.post === undefined ||
      path.post.responses === undefined
    ) {
      return false;
    }
    if (path.post.responses['stream'] != undefined) {
      return true;
    }
    return false;
  }
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
