import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SchemaObject } from 'openapi3-ts';
import {
  requestToCurl,
  ExampleArguments,
  requestToGo,
  requestToNode,
} from 'src/utils/api';
import * as types from '../types';

type Languages = 'javascript' | 'curl' | 'go';

type LanguagesObject = Record<Languages, string>;

// taken from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str: string): string {
  str = str.replace('ID', 'Id').replace("'", '').toLowerCase();
  let v = str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
  return v;
}

@Component({
  selector: 'app-request-block',
  templateUrl: './request-block.component.html',
})
export class RequestBlockComponent implements OnInit {
  @Input() requestSchema: SchemaObject = {};
  @Input() isStream = false;
  @Input() apiName = '';
  @Input() examples: types.ParsedExamples;

  showDropdown = false;

  selectedLanguage: Languages = 'curl';

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
          // example url https://gitcdn.link/repo/micro/services/main/examples/file/save/go/saveFile.go
          try {
            let rsp = await this.http
              .get(
                'https://gitcdn.link/repo/micro/services/main' +
                  '/examples/' +
                  this.apiName +
                  '/' +
                  exampleArguments.path.toLowerCase() +
                  '/go/' +
                  camelize(
                    this.examples[
                      exampleArguments.path.toLowerCase()
                    ][0].title.replace(',', ''),
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
          this.selectedLanguage = 'go';
          break;
        case 'curl':
          try {
            let rsp = await this.http
              .get(
                'https://gitcdn.link/repo/micro/services/main' +
                  '/examples/' +
                  this.apiName +
                  '/' +
                  exampleArguments.path.toLowerCase() +
                  '/curl/' +
                  camelize(
                    this.examples[
                      exampleArguments.path.toLowerCase()
                    ][0].title.replace(',', ''),
                  ) +
                  '.sh',
                {
                  responseType: 'text',
                },
              )
              .toPromise();
            this.code = rsp;
          } catch (e) {
            console.log('Error getting code example: ', e);
            this.code = requestToCurl(exampleArguments);
          }
          this.selectedLanguage = 'curl';
          break;
        case 'javascript':
          try {
            let rsp = await this.http
              .get(
                'https://gitcdn.link/repo/micro/services/main' +
                  '/examples/' +
                  this.apiName +
                  '/' +
                  exampleArguments.path.toLowerCase() +
                  '/node/' +
                  camelize(
                    this.examples[
                      exampleArguments.path.toLowerCase()
                    ][0].title.replace(',', ''),
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
            this.code = requestToNode(exampleArguments);
          }
          this.selectedLanguage = 'javascript';
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
