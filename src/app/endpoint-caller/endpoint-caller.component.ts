import { Component, OnInit, Input } from '@angular/core';
import * as types from '../types';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExploreService, ExploreAPI, API } from '../explore.service';
import { CookieService } from 'ngx-cookie-service';
import { V1ApiService } from '../v1api.service';
import * as openapi from 'openapi3-ts';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleApiService } from '../single-api.service';

var template = `<div id="content"></div>

<script src="https://web.m3o.com/assets/micro.js"></script>
<script type="text/javascript">
  document.addEventListener("DOMContentLoaded", function (event) {

    Micro.requireLogin(function () {
      Micro.post(
        "$serviceName/$endpointName",
        "$namespace",
        $reqJSON,
        function (data) {
          document.getElementById("content").innerHTML = "Response: " + JSON.stringify(data);
        }
      );
    });

  });
</script>`;

@Component({
  selector: 'app-endpoint-caller',
  templateUrl: './endpoint-caller.component.html',
  styleUrls: ['./endpoint-caller.component.css'],
})
export class EndpointCallerComponent implements OnInit {
  @Input() serviceName = '';
  @Input() endpointQuery = '';
  @Input() selectedVersion = '';
  @Input() selectedEndpoint = '';
  @Input() selectedExampleTitle = '';
  service: API;

  embeddable = template;
  token = '';

  // all examples for all endpoints
  examples = [];
  // examples for the selected endpoint
  endpointExamples = [];

  requestJSON = '';
  responseJSON = '';

  public configuration: Config;

  constructor(
    private ses: ServiceService,
    private notif: ToastrService,
    private v1api: V1ApiService,
    public us: UserService,
    private singleApiService: SingleApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.regenJSONs();
    this.us.v1ApiToken();
  }

  ngOnChanges() {
    this.selectEndpoint();
    this.responseJSON = '';
  }

  public parse(s: string): any {
    return JSON.parse(s);
  }

  onRunClick() {
    const isNotLoggedIn =
      !this.us.loggedIn() || !this.us.user || !this.us.user.name;

    if (isNotLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.callEndpoint();
  }

  regenJSONs() {
    const { service } = this.singleApiService;
    const { examples, openApi } = this.singleApiService.returnParsedContent();

    this.examples = examples;

    service.summary.endpoints.forEach((endpoint) => {
      let schema: openapi.SchemaObject = {};
      for (let key in openApi.paths) {
        if (key.endsWith('/' + endpoint.name.split('.')[1])) {
          schema = this.pathToRequestSchema(key, openApi);
        }
      }

      endpoint.requestJSON = this.schemaToJSON(schema);

      if (endpoint.requestJSON !== undefined) {
        endpoint.requestValue = JSON.parse(endpoint.requestJSON);
      } else {
        endpoint.requestValue = {};
      }

      // delete the cruft fro the value;
      endpoint.requestValue = this.deleteProtoCruft(endpoint.requestValue);

      // rebuild the request JSON value
      endpoint.requestJSON = JSON.stringify(endpoint.requestValue, null, 4);

      this.service = service;
      if (!this.selectedEndpoint) {
        this.selectedEndpoint = this.service.summary.endpoints[0].name;
      }
      this.selectExample();
    });
  }

  lastPart(s: string): string {
    let ss = s.split('/');
    return ss[ss.length - 1];
  }

  selectEndpoint() {
    if (!this.service) {
      return;
    }

    let e = this.service.summary.endpoints.filter((v) => {
      return v.name == this.selectedEndpoint;
    })[0];
    console.log('setting', e);
    this.requestJSON = e.requestJSON;
    this.selectExample();
  }

  lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
  }

  selectExample() {
    this.endpointExamples =
      this.examples[
        this.lowercaseFirstLetter(this.selectedEndpoint.split('.')[1])
      ];

    if (this.selectedExampleTitle == '' || !this.endpointExamples) {
      this.requestJSON = this.service.summary.endpoints.find((v) => {
        return v.name == this.selectedEndpoint;
      }).requestJSON;
      return;
    }

    this.requestJSON = JSON.stringify(
      this.endpointExamples.filter((v) => {
        return v.title == this.selectedExampleTitle;
      })[0].request,
      null,
      4,
    );
  }

  jsUcfirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  pathToRequestSchema(
    path: string,
    api: openapi.OpenAPIObject,
  ): openapi.SchemaObject {
    let paths = path.split('/');
    let endpointName = paths[paths.length - 1];
    let serviceName = this.jsUcfirst(this.serviceName);

    if (
      api &&
      api.components.schemas &&
      api.components.schemas[endpointName + 'Request']
    ) {
      return api.components.schemas[endpointName + 'Request'];
    } else if (
      // this is just a quick hack to support the helloworld example
      api &&
      api.components.schemas &&
      api.components.schemas['Request']
    ) {
      return api.components.schemas['Request'];
    }
    return {};
  }

  apiURL(): string {
    if (!this) {
      return;
    }
    return this.ses.url();
  }

  namespace(): string {
    if (!this) {
      return;
    }
    return this.ses.namespace();
  }

  columns(endpoint: types.Endpoint): Columns[] {
    return Object.keys(endpoint.responseValue[0]).map((k) => {
      return { key: k, title: k };
    });
  }

  callEndpoint() {
    this.us
      .v1ApiToken()
      .then((tok) => {
        return this.v1api
          .call(
            {
              endpoint: this.selectedEndpoint,
              service: this.service.api.name,
              method: 'POST',
              request: this.requestJSON,
            },
            tok,
          )
          .then((rsp) => {
            this.responseJSON = rsp;
          });
      })
      .catch((e) => {
        try {
          if (e.error.Code == 401) {
            // try to get a new token if the current one is
            // not up to scratch
            return this.us.revokeV1ApiToken().then(() => {
              this.us.v1ApiToken().then((tok) => {
                return this.v1api
                  .call(
                    {
                      endpoint: this.selectedEndpoint,
                      service: this.service.api.name,
                      method: 'POST',
                      request: this.requestJSON,
                    },
                    tok,
                  )
                  .then((rsp) => {
                    this.responseJSON = rsp;
                  });
              });
            });
          }
          this.notif.error('Error calling service', e.error.Detail);
        } catch {
          this.notif.error('Error calling service', e);
        }
      });
  }

  // https://stackoverflow.com/questions/50139508/input-loses-focus-when-editing-value-using-ngfor-and-ngmodel-angular5
  trackByFn(index, item) {
    return index;
  }

  callEndpointForm(service: types.Service, endpoint: types.Endpoint) {
    // hack to not modify original
    var obj = JSON.parse(JSON.stringify(endpoint.requestValue));
    Object.keys(obj).forEach(
      (k) => !obj[k] && obj[k] !== undefined && delete obj[k],
    );

    this.ses
      .call({
        endpoint: endpoint.name,
        service: service.name,
        address: service.nodes[0].address,
        method: 'POST',
        request: JSON.stringify(obj),
      })
      .then((rsp) => {
        var jsonRsp = JSON.parse(rsp);
        var keys = Object.keys(jsonRsp);
        endpoint.responseValue = jsonRsp[keys[0]];
        // If the response is of format
        // {'message':'hi'}
        // we want to transform that to appear like it's
        // a list: [{'message':'hi'}] so it displays nicely
        if (
          typeof endpoint.responseValue === 'string' ||
          endpoint.responseValue instanceof String
        ) {
          var k = keys[0];
          var obj = {};
          obj[k] = jsonRsp[keys[0]];
          endpoint.responseValue = [obj];
        }
      })
      .catch((e) => {
        try {
          this.notif.error('Error calling service', e.error.Detail);
        } catch {
          this.notif.error('Error calling service', e);
        }
      });
  }

  deleteProtoCruft(value: Object): Object {
    // super hack to remove protocruft
    for (const key in value) {
      if (key == 'MessageState') {
        delete value['MessageState'];
      } else if (key == 'int32') {
        delete value['int32'];
      } else if (key == 'unknownFields') {
        delete value['unknownFields'];
      }
    }

    return value;
  }

  formatValue(value: unknown): any {
    if (typeof value === 'object') {
      return JSON.stringify(this.deleteProtoCruft(value));
    }
    return value;
  }

  formatEndpoint(service: string, endpoint: string): string {
    var parts = endpoint.split('.', -1);

    if (parts[0].toLowerCase() === service) {
      return '/' + service + '/' + parts[1];
    }

    return '/' + service + '/' + endpoint.replace('.', '/');
  }

  formatName(name: string): string {
    if (name === '') {
      return '';
    }

    name = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
    var newName = name.split('.', -1);
    return newName[1];
  }

  valueToString(input: types.Value, indentLevel: number): string {
    if (!input) return '';

    if (input.name == 'MessageState') {
      return '';
    } else if (input.name == 'int32') {
      return '';
    } else if (input.name == 'unknownFields') {
      return '';
    }

    const indent = Array(indentLevel).join('\t');
    const fieldSeparator = `\n\t`;

    if (input.values) {
      var vals = input.values
        .map((field) => this.valueToString(field, indentLevel + 1))
        .filter(Boolean)
        .join(fieldSeparator);

      if (indentLevel == 0) {
        if (vals.trim().length == 0) {
          return '{}';
        }
        return '{\n\t' + vals + '\n}';
      }

      return `${indentLevel == 0 ? '' : indent}${
        indentLevel == 0 ? '' : input.type
      } ${indentLevel == 0 ? '' : input.name} {\n\t${vals}\n\t${indent}}`;
    } else if (indentLevel == 0) {
      return `{}`;
    }

    return `${indent}${input.name} ${input.type}`;
  }

  schemaToJSON(schema: openapi.SchemaObject): string {
    let recur = function (schema: openapi.SchemaObject): Object {
      switch (schema.type as string) {
        case 'object':
          let ret = {};
          for (let key in schema.properties) {
            ret[key] = recur(schema.properties[key]);
          }
          return ret;
        case 'array':
          switch ((schema.items as any).type) {
            case 'object':
              return [recur(schema.items)];
            case 'string':
              return [''];
            case 'int':
            case 'int32':
            case 'int64':
              return [0];
            case 'bool':
              return [false];
          }
        case 'string':
          return '';
        case 'int':
        case 'int32':
        case 'int64':
          return 0;
        case 'bool':
          return false;
        // typescript types below
        case 'number':
          return 0;
        case 'boolean':
          return false;
        default:
          return schema.type;
      }
    };

    return JSON.stringify(recur(schema), null, 2);
  }

  // code editor
  coptions = {
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

  // code editor
  htmlOptions = {
    automaticLayout: true,
    theme: 'vs-light',
    folding: false,
    glyphMargin: false,
    language: 'html',
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

  pickVersion(services: types.Service[]): types.Service[] {
    return services.filter((s) => {
      return s.version == this.selectedVersion;
    });
  }
}
