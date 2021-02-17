import { Component, OnInit, Inject } from "@angular/core";
import { UserService } from "../user.service";
import { V1ApiService } from '../v1api.service';
import * as types from '../types';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"]
})
export class SettingsComponent implements OnInit {
  public keys: types.APIKey[] = [] as types.APIKey[];

  constructor(
    public us: UserService,
    private v1api: V1ApiService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.listKeys();
  }

  listKeys(): void {
    this.v1api
      .listKeys()
      .then((keys) => {
        this.keys = keys;
      })
      .catch((e) => {
        // TODO
      });
  }


  revokeKey(key: types.APIKey) {
    if (!confirm('Are you sure you want to delete "'+key.description + '"')) {
      return;
    }
    this.v1api
      .revokeKey(key)
      .then((v) => {
        this.listKeys();
      })
      .catch((e) => {
        // TODO
      });
  }

  createKeyDialog() {
    const dialogRef = this.dialog.open(CreateKeyDialogComponent, {
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.listKeys();
    });
  }

  languages = ["bash"];
}

export interface DialogData {
  description: string;
  scopes: string[];
}


export interface Input {
  description: string;
  scopes: string;
}


@Component({
  selector: 'app-create-key-dialog',
  templateUrl: './createkey.component.html',
})
export class CreateKeyDialogComponent {

  public input: Input = {} as Input;
  public errorMsg = '';
  public apiKey = '';

  constructor(
    public dialogRef: MatDialogRef<CreateKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private v1api: V1ApiService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(): void {
    if (this.apiKey) {
      this.dialogRef.close(this.apiKey);
      return;
    }
    this.v1api.createKey(this.input.description, this.input.scopes.split(',')).then(apiKey => {
      this.apiKey = apiKey;
    }).catch((e) => {
      console.log("ERROR" +JSON.stringify(e));
      // this.dialogRef.close();
    });

  }

}
