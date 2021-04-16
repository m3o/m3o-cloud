import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceService } from '../service.service';
import * as types from '../types';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ExploreService, Service } from '../explore.service';
import * as openapi from 'openapi3-ts';
import { UserService } from '../user.service';

const tabNamesToIndex = {
  '': 0,
  logs: 1,
  stats: 2,
  nodes: 3,
  traces: 4,
  events: 5,
};

const tabIndexesToName = {
  0: '',
  1: 'logs',
  2: 'stats',
  3: 'nodes',
  4: 'traces',
  5: 'events',
};

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
  service: Service;
  logs: types.LogRecord[];
  stats: types.DebugSnapshot[] = [];
  traceSpans: types.Span[];
  events: types.Event[];
  openAPI: openapi.OpenAPIObject = {} as any;

  selectedVersion = '';
  serviceName: string;
  endpointQuery: string;
  intervalId: any;
  // refresh stats
  refresh = true;
  refreshLogs = true;

  selected = 0;
  tabValueChange = new Subject<number>();
  user: types.Account;

  constructor(
    private ses: ServiceService,
    private ex: ExploreService,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private notif: ToastrService,
    public us: UserService
  ) {}

  ngOnInit() {
    this.user = this.us.user;
    this.activeRoute.params.subscribe((p) => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.serviceName = <string>p['id'];
      this.loadAPI();
      this.loadVersionData();
      const tab = <string>p['tab'];
      if (tab) {
        this.selected = tabNamesToIndex[tab];
      }
    });
  }

  loadAPI() {
    this.ex.search(this.serviceName).then((servs) => {
      this.service = servs.filter((s) => s.service.name == this.serviceName)[0];
      this.openAPI = JSON.parse(this.service.openAPIJSON);
      console.log(this.openAPI);
    });
  }

  loadVersionData() {}
  jsOptions = {
    automaticLayout: true,
    theme: 'vs-light',
    folding: false,
    glyphMargin: false,
    language: 'json',
    lineNumbers: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    renderLineHighlight: false,
    renderIndentGuides: false,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
    },
  };

  specEditing = false;
  editSpec() {
    this.specEditing = !this.specEditing;
  }

  saveSpec() {
    this.ex
      .saveMeta(
        this.service.service.name,
        this.service.readme,
        this.service.openAPIJSON
      )
      .then(() => {
        this.editSpec();
        this.loadAPI();
      });
  }

  valueToJson(input: types.Value, indentLevel: number): string {
    const typeToDefault = (type: string): string => {
      switch (type) {
        case "string":
          return '""';
        case "int":
        case "int32":
        case "int64":
          return "0";
        case "bool":
          return "false";
        default:
          return "{}";
      }
    };

    if (!input) return "";

    const indent = Array(indentLevel).join("    ");
    const fieldSeparator = `,\n`;
    if (input.values) {
      return `${indent}${indentLevel == 1 ? "{" : '"' + input.name + '": {'}
${input.values
  .map((field) => this.valueToJson(field, indentLevel + 1))
  .join(fieldSeparator)}
${indent}}`;
    } else if (indentLevel == 1) {
      return `{}`;
    }

    return `${indent}"${input.name}": ${typeToDefault(input.type)}`;
  }

  endpointOf(path: string): types.Endpoint {
    let es = this.service.service.endpoints.filter(e => {
      return e.name.includes(this.lastPart(path))
    })
    if (es.length > 0) {
      return es[0]
    }
    return {} as types.Endpoint
  }

  lastPart(s :string): string {
    let ss = s.split("/")
    return ss[ss.length - 1]
  }

  versionSelected(service: types.Service) {
    if (this.selectedVersion == service.version) {
      this.selectedVersion = '';
      return;
    }
    this.selectedVersion = service.version;
    this.loadVersionData();
  }

  tabChange($event: number) {
    this.selected = $event;
    this.location.replaceState(
      '/' + this.serviceName + '/' + tabIndexesToName[this.selected]
    );
    this.tabValueChange.next(this.selected);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  code: string = '{}';

  pathToRequestSchema(path: string): openapi.SchemaObject {
    let paths = path.split('/');
    let endpointName = paths[paths.length - 1];
    let serviceName = jsUcfirst(this.serviceName);

    if (
      this.openAPI &&
      this.openAPI.components.schemas &&
      this.openAPI.components.schemas[endpointName + 'Request']
    ) {
      return this.openAPI.components.schemas[endpointName + 'Request'];
    }
    return {};
  }

  pathToResponseSchema(path: string): openapi.SchemaObject {
    let paths = path.split('/');
    let endpointName = paths[paths.length - 1];
    let serviceName = jsUcfirst(this.serviceName);

    if (
      this.openAPI &&
      this.openAPI.components.schemas &&
      this.openAPI.components.schemas[endpointName + 'Response']
    ) {
      return this.openAPI.components.schemas[endpointName + 'Response'];
    }
    return {};
  }
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}