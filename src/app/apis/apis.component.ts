import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../user.service';
import { V1ApiService } from '../v1api.service';
import { QuotaService } from '../quota.service';
import * as types from '../types';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormArray, FormBuilder, FormGroup, FormControl} from '@angular/forms';


@Component({
  selector: 'app-apis',
  templateUrl: './apis.component.html',
  styleUrls: ['./apis.component.css']
})
export class ApisComponent implements OnInit {

  public quotas: Map<string, types.Quota>;
  public quotaUsage: types.QuotaUsage[];
  public availableAPIs: string[];

  constructor(
    public us: UserService,
    private v1api: V1ApiService,
    private quota: QuotaService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.listQuotas();
    this.listQuotaUsage();
    this.v1api.listAPIs().then((v) => {
      v.sort();
      this.availableAPIs = v;
    });
  }

  listQuotas(): void {
    this.quotas = new Map<string, types.Quota>();
    this.quota.listQuotas()
      .then((qs) => {
        qs.forEach(v => {
          this.quotas.set(v.id, v);
        });
      })
      .catch((e) => {
        // TODO
        console.log(e);
      });
  }

  listQuotaUsage(): void {
    this.quota.listUsage()
      .then((qs) => {
        this.quotaUsage = qs;
      })
      .catch((e) => {
        // TODO
        console.log(e);
      });
  }


}

