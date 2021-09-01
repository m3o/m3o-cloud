import { Component, OnInit, Input } from '@angular/core';
import { SchemaObject } from 'openapi3-ts';
import {
  requestToCurl,
  ExampleArguments,
  requestToGo,
  requestToNode,
} from 'src/utils/api';

type Languages = 'javascript' | 'curl' | 'go';

type LanguagesObject = Record<Languages, string>;

@Component({
  selector: 'app-request-block',
  templateUrl: './request-block.component.html',
})
export class RequestBlockComponent implements OnInit {
  @Input() requestSchema: SchemaObject = {};

  @Input() apiName = '';

  showDropdown = false;

  selectedLanguage: Languages = 'javascript';

  code = '';

  languages: LanguagesObject = {
    javascript: 'nodejs',
    go: 'go',
    curl: 'cURL',
  };

  constructor() {}

  ngOnInit(): void {
    this.updateCodeBlock();
  }

  updateCodeBlock() {
    const exampleArguments: ExampleArguments = {
      request: this.requestSchema,
      path: '/',
      serviceName: this.apiName,
    };

    switch (this.selectedLanguage) {
      case 'go':
        this.code = requestToGo(exampleArguments);
        break;
      case 'curl':
        this.code = requestToCurl(exampleArguments);
        break;
      case 'javascript':
        this.code = requestToNode(exampleArguments);
        break;
      default:
        this.code = '';
    }
  }

  changeLanguage(language: Languages): void {
    this.selectedLanguage = language;
    this.showDropdown = false;
    this.updateCodeBlock();
  }
}
