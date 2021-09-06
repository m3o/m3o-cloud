import { Component, OnInit } from '@angular/core';
import { downloadFile } from 'src/utils/file';
import { SingleApiService } from '../single-api.service';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.component.html',
})
export class DownloadModalComponent implements OnInit {
  constructor(private singleApiService: SingleApiService) {}

  ngOnInit(): void {}

  onDownloadPostman() {
    const { service } = this.singleApiService;
    downloadFile(service.api.postman_json, 'postman');
  }

  onDownloadOpenApi() {
    const { service } = this.singleApiService;
    downloadFile(service.api.open_api_json, 'openapi');
  }
}
