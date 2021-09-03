import { Component, OnInit, Inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../user.service';
import { V1ApiService } from '../v1api.service';
import * as types from '../types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  constructor(
    public us: UserService,
    private cookie: CookieService,
    private v1api: V1ApiService,
    public dialog: MatDialog,
  ) {}
  public keys: types.APIKey[] = [] as types.APIKey[];

  languages = ['bash'];

  ngOnInit() {
    this.us.v1ApiToken();
    this.listKeys();
  }

  personalToken(): string {
    return this.cookie.get('micro_api_token');
  }

  listKeys(): void {
    this.v1api
      .listKeys()
      .then((keys) => {
        // sort newest first
        keys.sort((a, b) => {
          return b.createdTime - a.createdTime;
        });
        this.keys = keys;
      })
      .catch((e) => {
        // TODO
        console.log(e);
      });
  }

  revokeKey(key: types.APIKey) {
    if (!confirm('Are you sure you want to delete "' + key.description + '"')) {
      return;
    }
    this.v1api
      .revokeKey(key.id)
      .then((v) => {
        this.listKeys();
      })
      .catch((e) => {
        // TODO
      });
  }

  createKeyDialog() {
    const dialogRef = this.dialog.open(CreateKeyDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.listKeys();
    });
  }
}

export interface DialogData {
  description: string;
  scopes: string[];
}

export interface Input {
  description: string;
  scopes: string;
}

export interface ScopeCheckbox {
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-create-key-dialog',
  templateUrl: './createkey.component.html',
})
export class CreateKeyDialogComponent {
  public description = '';
  public errorMsg = '';
  public apiKey = '';
  public form: FormGroup;
  public scopes = [] as string[];
  public scopesForm = new FormControl();
  public showCopiedText = false;

  constructor(
    public dialogRef: MatDialogRef<CreateKeyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private v1api: V1ApiService,
  ) {
    this.v1api.listAPIs().then((value) => {
      this.scopes = value;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreateClick(): void {
    if (this.apiKey) {
      this.dialogRef.close(this.apiKey);
      return;
    }
    this.errorMsg = '';
    let selectedScopes = this.scopesForm.value as string[];
    if (!selectedScopes || selectedScopes.length === 0) {
      // select all
      selectedScopes = ['*'] as string[];
    }
    this.v1api
      .createKey(this.description, selectedScopes)
      .then((apiKey) => {
        this.apiKey = apiKey.api_key;
      })
      .catch((e) => {
        this.errorMsg =
          'There was an error creating the key. Please try again later.';
        console.log('ERROR' + JSON.stringify(e));
      });
  }

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.apiKey);

      this.showCopiedText = true;

      setTimeout(() => {
        this.showCopiedText = false;
      }, 500);
    } catch (e) {
      console.log(e);
    }
  }
}
