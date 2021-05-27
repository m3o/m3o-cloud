import { Component, OnInit, Input } from '@angular/core';
import * as types from '../types';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { ExploreService, ExploreAPI } from '../explore.service';
import { CookieService } from 'ngx-cookie-service';
import { V1ApiService } from '../v1api.service';
import * as openapi from 'openapi3-ts';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

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
  @Input() serviceName: string = '';
  @Input() endpointQuery: string = '';
  @Input() selectedVersion: string = '';
  service: ExploreAPI;

  selectedEndpoint = '';
  embeddable = template;
  token = '';

  // all examples for all endpoints
  examples = [];
  // examples for the selected endpoint
  endpointExamples = [];
  selectedExampleTitle = 'default';

  requestJSON = '';
  responseJSON = '';

  public configuration: Config;

  constructor(
    private ses: ServiceService,
    private ex: ExploreService,
    private notif: ToastrService,
    private cs: CookieService,
    private v1api: V1ApiService,
    public us: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.selectedEndpoint = this.route.snapshot.queryParamMap.get('endpoint');
    this.route.queryParamMap.subscribe((queryParams) => {
      // hack
      if (queryParams.get('endpoint')) {
        this.selectedEndpoint =
          this.jsUcfirst(this.serviceName) +
          '.' +
          this.jsUcfirst(queryParams.get('endpoint'));
      }
    });
    if (this.route.snapshot.queryParamMap.get('example')) {
      this.selectedExampleTitle =
        this.route.snapshot.queryParamMap.get('example');
    }
    this.route.queryParamMap.subscribe((queryParams) => {
      if (queryParams.get('example')) {
        this.selectedExampleTitle = queryParams.get('example');
      }
    });

    this.regenJSONs();
    if (!this.cs.get('micro_api_token')) {
      this.v1api
        .createKey('Web Token', ['*'])
        .then((apiKey) => {
          this.token = apiKey;
          this.cs.set('micro_api_token', apiKey);
        })
        .catch((e) => {
          console.log('ERROR' + JSON.stringify(e));
        });
    } else {
      this.token = this.cs.get('micro_api_token');
    }
  }

  public parse(s: string): any {
    return JSON.parse(s);
  }

  regenJSONs() {
    this.ex.search(this.serviceName).then((services) => {
      let s = services.filter(
        (serv) => serv.detail.name == this.serviceName
      )[0];
      var openAPI: openapi.OpenAPIObject = JSON.parse(s.api.open_api_json);
      if (s.api.examples_json) {
        this.examples = JSON.parse(s.api.examples_json);
      }

      s.detail.endpoints.forEach((endpoint) => {
        let schema: openapi.SchemaObject = {};
        for (let key in openAPI.paths) {
          if (key.includes(endpoint.name.split('.')[1])) {
            schema = this.pathToRequestSchema(key, openAPI);
          }
        }
        endpoint.requestJSON = this.schemaToJSON(schema);
        console.log(endpoint, 'hi', endpoint.name, schema);
        if (endpoint.requestJSON !== undefined) {
          endpoint.requestValue = JSON.parse(endpoint.requestJSON);
        } else {
          endpoint.requestValue = {};
        }

        // delete the cruft fro the value;
        endpoint.requestValue = this.deleteProtoCruft(endpoint.requestValue);

        // rebuild the request JSON value
        endpoint.requestJSON = JSON.stringify(endpoint.requestValue, null, 4);
      });
      this.service = s;
      if (!this.selectedEndpoint) {
        this.selectedEndpoint = this.service.detail.endpoints[0].name;
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

    let e = this.service.detail.endpoints.filter((v) => {
      return v.name == this.selectedEndpoint;
    })[0];
    this.requestJSON = e.requestJSON;
    this.selectExample();
  }

  selectExample() {
    this.endpointExamples =
      this.examples[this.selectedEndpoint.split('.')[1].toLowerCase()];

    if (!this.selectedExampleTitle) {
      return;
    }

    if (this.selectedExampleTitle == 'default' || !this.endpointExamples) {
      this.requestJSON = this.service.detail.endpoints.find((v) => {
        return v.name == this.selectedEndpoint;
      }).requestJSON;
      return;
    }

    this.requestJSON = JSON.stringify(
      this.endpointExamples.filter((v) => {
        return v.title == this.selectedExampleTitle;
      })[0].request,
      null,
      ' '
    );
  }

  jsUcfirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  pathToRequestSchema(
    path: string,
    api: openapi.OpenAPIObject
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
    this.v1api
      .call(
        {
          endpoint: this.selectedEndpoint,
          service: this.service.detail.name,
          address: this.service.detail.nodes[0].address,
          method: 'POST',
          request: this.requestJSON,
        },
        this.token
      )
      .then((rsp) => {
        this.responseJSON = rsp;
      })
      .catch((e) => {
        try {
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
      (k) => !obj[k] && obj[k] !== undefined && delete obj[k]
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
      return '';
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
