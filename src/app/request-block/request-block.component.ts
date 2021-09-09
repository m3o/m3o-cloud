import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SchemaObject } from 'openapi3-ts';
import {
  requestToCurl,
  ExampleArguments,
  requestToGo,
  requestToNode,
} from 'src/utils/api';

type Languages = 'javascript' | 'curl' | 'go';

type LanguagesObject = Record<Languages, string>;

interface ApiMethodExample {
  request: Record<string, any>;
  response: Record<string, any>;
  title: string;
}

interface ParsedExamples {
  [key: string]: Array<ApiMethodExample>;
}

// taken from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

@Component({
  selector: 'app-request-block',
  templateUrl: './request-block.component.html',
})
export class RequestBlockComponent implements OnInit {
  @Input() requestSchema: SchemaObject = {};
  @Input() isStream = false;
  @Input() apiName = '';
  @Input() examples: ParsedExamples;

  showDropdown = false;

  selectedLanguage: Languages = 'javascript';

  code = '';

  languages: LanguagesObject = {
    javascript: 'nodejs',
    go: 'go',
    curl: 'cURL',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.updateCodeBlock();
  }

  async updateCodeBlock(): Promise<ExampleArguments> {
    return new Promise(async (resolve, reject) => {
      const exampleArguments: ExampleArguments = {
        request: this.requestSchema,
        path: this.requestSchema.title.replace('Request', ''),
        serviceName: this.apiName,
        isStream: this.isStream,
      };

      switch (this.selectedLanguage) {
        case 'go':
          // example url https://gitcdn.link/repo/micro/micro-go/main/file/examples/save/saveFile.go
          try {
            let rsp = await this.http
              .get(
                'https://gitcdn.link/repo/micro/micro-go/main/' +
                  this.apiName +
                  '/examples/' +
                  exampleArguments.path.toLowerCase() +
                  '/' +
                  camelize(
                    this.examples[exampleArguments.path.toLowerCase()][0].title,
                  ) +
                  '.go',
                {
                  responseType: 'text',
                },
              )
              .toPromise();
            this.code = rsp;
          } catch (e) {
            console.log('Error getting code example: ', e);
            this.code = requestToGo(exampleArguments);
          }
          break;
        case 'curl':
          this.code = requestToCurl(exampleArguments);
          break;
        case 'javascript':
          try {
            let rsp = await this.http
              .get(
                'https://gitcdn.link/repo/m3o/m3o-js/main/' +
                  this.apiName +
                  '/examples/' +
                  exampleArguments.path.toLowerCase() +
                  '/' +
                  camelize(
                    this.examples[exampleArguments.path.toLowerCase()][0].title,
                  ) +
                  '.js',
                {
                  responseType: 'text',
                },
              )
              .toPromise();
            this.code = rsp;
          } catch (e) {
            console.log('Error getting code example: ', e);
            this.code = requestToGo(exampleArguments);
          }
          break;
        default:
          this.code = '';
      }

      resolve(exampleArguments);
    });
  }

  changeLanguage(language: Languages): void {
    this.selectedLanguage = language;
    this.showDropdown = false;
    this.updateCodeBlock();
  }
}
