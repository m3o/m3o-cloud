import { Component, OnInit, Input } from '@angular/core';
import { SingleApiService } from '../single-api.service';

@Component({
  selector: 'app-api-page-header',
  templateUrl: './api-page-header.component.html',
})
export class ApiPageHeaderComponent implements OnInit {
  constructor(public singleApiService: SingleApiService) {}

  ngOnInit(): void {}
}
