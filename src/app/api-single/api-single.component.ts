import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceService } from '../service.service';
import * as types from '../types';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ExploreService, ExploreAPI, API } from '../explore.service';
import * as openapi from 'openapi3-ts';
import { UserService } from '../user.service';
import { V1ApiService } from '../v1api.service';

const tabNamesToIndex = {
  '': 0,
  query: 1,
};

const tabIndexesToName = {
  0: '',
  1: 'query',
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
  service: API;
  logs: types.LogRecord[];
  stats: types.DebugSnapshot[] = [];
  traceSpans: types.Span[];
  events: types.Event[];
  openAPI: openapi.OpenAPIObject = {} as any;
  postman: any;

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
  fragment: string;
  hasKeys = true;

  constructor(
    private ses: ServiceService,
    private ex: ExploreService,
    private activeRoute: ActivatedRoute,
    private location: Location,
    private notif: ToastrService,
    public us: UserService,
    private v1api: V1ApiService,
  ) {}

  hasAPIKeys(): void {
    this.v1api
      .listKeys()
      .then((keys) => {
        this.hasKeys = keys && keys.length > 0;
      })
      .catch((e) => {
        this.hasKeys = false;
      });
  }

  ngOnInit() {
    //this.hasAPIKeys();
    this.user = this.us.user;
    this.activeRoute.fragment.subscribe((fragment) => {
      this.fragment = fragment;
    });
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

  examples = {};

  loadAPI() {
    this.ex.service(this.serviceName).then((serv) => {
      this.service = serv;
      this.openAPI = JSON.parse(this.service.api.open_api_json);
      this.postman = JSON.parse(this.service.api.postman_json);
      for (let key in this.openAPI.paths) {
        this.showJSON[key] = false;
      }
      if (this.service.api.examples_json) {
        this.examples = JSON.parse(this.service.api.examples_json);
      }

      setTimeout(() => {
        try {
          document.querySelector('#' + this.fragment).scrollIntoView();
        } catch (e) {
          console.log(e);
        }
      }, 300);
    });
  }

  displayPrice(
    pricing: Map<string, string>,
    name: string,
    key: string,
  ): string {
    if (pricing === undefined) {
      return 'Free';
    }

    let ss = key.split('/');
    let ep = ss[2] + '.' + ss[3];
    let price = pricing[ep];

    if (price === '' || price === undefined) {
      return 'Free';
    }

    let p: number = Number(price);

    return '$' + p / 1000000 + ' per request';
  }

  formatName(name: string): string {
    if (name === '') {
      return '';
    }

    return name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  }

  stringify(a: any): string {
    return JSON.stringify(a, null, ' ');
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
        this.service.api.name,
        this.service.api.description,
        this.service.api.open_api_json,
      )
      .then(() => {
        this.editSpec();
        this.loadAPI();
      });
  }

  firstReadmeLine(): string {
    return this.service.api.description.split('\n').filter((l) => {
      return !l.startsWith('#') && l.length > 5;
    })[0];
  }

  showJSON = {};

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
    return JSON.stringify(recur(schema), null, 4);
  }

  example(
    path: string,
    stream: boolean,
    request: openapi.SchemaObject,
    response: openapi.SchemaObject,
    language: string,
  ): string {
    switch (language) {
      case 'go':
        return this.exampleGo(path, stream, request, response);
      case 'node':
        return this.exampleNode(path, stream, request, response);
      case 'curl':
        return this.exampleCurl(path, stream, request, response);
    }
    return '';
  }

  exampleNode(
    path: string,
    stream: boolean,
    request: openapi.SchemaObject,
    response: openapi.SchemaObject,
  ): string {
    if (stream != true) {
      return (
        `// npm install --save @m3o/m3o-node 
const m3o = require('@m3o/m3o-node');

new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE' })
  .call('` +
        this.serviceName +
        `', '` +
        this.lastPart(path) +
        `', ` +
        this.schemaToJSON(request) +
        `)
  .then((response) => {
    console.log(response);
});`
      );
    }

    return (
      `// npm install --save @m3o/m3o-node
const m3o = require('@m3o/m3o-node');

new m3o.Client({ token: 'INSERT_YOUR_YOUR_M3O_TOKEN_HERE' })
  .stream('` +
      this.serviceName +
      `', '` +
      this.lastPart(path) +
      `', ` +
      this.schemaToJSON(request) +
      `)
  .then(stream => {
    stream.recv(msg => { console.log(msg) };
  })
);`
    );
  }

  exampleCurl(
    path: string,
    stream: boolean,
    request: openapi.SchemaObject,
    response: openapi.SchemaObject,
  ): string {
    if (stream != true) {
      return (
        `curl "https://api.m3o.com/v1/` +
        this.serviceName +
        `/` +
        this.lastPart(path) +
        `" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer INSERT_YOUR_TOKEN_HERE" \\
-d '` +
        this.schemaToJSON(request) +
        `'`
      );
    }

    return (
      `curl "https://api.m3o.com/v1/` +
      this.serviceName +
      `/` +
      this.lastPart(path) +
      `" \\
--include \\
--no-buffer \\
--header "Connection: Upgrade" \\
--header "Upgrade: websocket" \\
--header "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \\
--header "Sec-WebSocket-Version: 13" \\
-H "Authorization: Bearer INSERT_YOUR_TOKEN_HERE" \\
-H 'Content-Type: application/json' \\
-d '` +
      this.schemaToJSON(request) +
      `'`
    );
  }

  exampleGo(
    path: string,
    stream: boolean,
    request: openapi.SchemaObject,
    response: openapi.SchemaObject,
  ): string {
    if (stream != true) {
      return (
        `package main

import (
	"fmt"

	"github.com/m3o/m3o-go/client"
)
    
func main() {
	c := client.NewClient(&client.Options{
		Token: "INSERT_YOUR_TOKEN_HERE",
	})

	req := ` +
        this.schemaToGoMap(request) +
        `
	var rsp map[string]interface{}

	if err := c.Call("` +
        this.serviceName +
        `", "` +
        this.lastPart(path) +
        `", req, &rsp); err != nil {
		fmt.Println(err)
		return
	}
}`
      );
    }

    return (
      `package main

import (
	"fmt"

	"github.com/m3o/m3o-go/client"
)
    
func main() {
	c := client.NewClient(&client.Options{
		Token: "INSERT_YOUR_TOKEN_HERE",
	})

	req := ` +
      this.schemaToGoMap(request) +
      `
	stream, err := c.Stream("` +
      this.serviceName +
      `", "` +
      this.lastPart(path) +
      `", req)
	if err != nil {
		fmt.Println(err)
		return
	}

	for {
		var rsp map[string]interface{}
		if err := stream.Recv(&rsp); err != nil {
			return
		}
		fmt.Println(rsp)
	}
}`
    );
  }

  exampleLanguage = 'node';

  // this is an unfinished method to convert
  // openapi schemas to go struct type definitions
  schemaToGoMap(schema: openapi.SchemaObject): string {
    const prefix = '  ';
    let recur = function (schema: openapi.SchemaObject, level: number): string {
      switch (schema.type as string) {
        case 'object':
          let ret = prefix.repeat(level) + 'map[string]interface{}{\n';

          for (let key in schema.properties) {
            ret +=
              prefix.repeat(level + 8) +
              '"' +
              key +
              '"' +
              ' : ' +
              recur(schema.properties[key], level + 1) +
              ',\n';
          }
          ret += prefix.repeat(level + 4) + '}';
          if (level > 1) {
            ret += ',\n';
          } else {
            ret += '\n';
          }
          return ret;
        case 'array':
          switch ((schema.items as any).type) {
            case 'object':
              return (
                '[]interface{}{\n' +
                recur(schema.items, level + 1) +
                prefix.repeat(level) +
                '}'
              );
            case 'string':
              return '[]interface{}{""}';
            case 'int':
            case 'int32':
            case 'number':
            case 'int64':
              return '[]interface{}{0}';
            case 'boolean':
            case 'bool':
              return '[]interface{}{false}';
          }
        case 'string':
          return '""';
        case 'int':
        case 'int32':
        case 'number':
        case 'int64':
          return '0';
        case 'boolean':
        case 'bool':
          return 'false';
        default:
          return schema.type;
      }
      return '';
    };

    return recur(schema, 0);
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
    this.loadVersionData();
  }

  tabChange($event: number) {
    this.selected = $event;
    this.location.replaceState(
      '/' + this.serviceName + '/' + tabIndexesToName[this.selected],
    );
    this.tabValueChange.next(this.selected);
  }

  ngOnDestroy() {
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
    } else if (
      // this is just a quick hack to support the helloworld example
      this.openAPI &&
      this.openAPI.components.schemas &&
      this.openAPI.components.schemas['Request']
    ) {
      return this.openAPI.components.schemas['Request'];
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
    } else if (
      // this is just a quick hack to support the helloworld example
      this.openAPI &&
      this.openAPI.components.schemas &&
      this.openAPI.components.schemas['Response']
    ) {
      return this.openAPI.components.schemas['Response'];
    }
    return {};
  }

  downloadPostman() {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.postman)),
    );
    element.setAttribute('download', this.serviceName + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  downloadOpenAPI() {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(this.openAPI)),
    );
    element.setAttribute('download', this.serviceName + '.json');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
}

function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
