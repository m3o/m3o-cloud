import { Component, OnInit, Input, Inject } from '@angular/core';
import { UserService } from '../user.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

export interface DialogData {
  src: string;
  fullsrc: string;
  namespace: string;
  email: string;
}

@Component({
  selector: 'app-snippet',
  templateUrl: './snippet.component.html',
  styleUrls: ['./snippet.component.css'],
})
export class SnippetComponent implements OnInit {
  @Input() src: string = '';
  @Input() fullsrc: string = '';

  constructor(public dialog: MatDialog, private us: UserService) {}

  ngOnInit() {}

  open() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '90%',
      maxWidth: '750px',
      data: {
        src: this.src,
        fullsrc: this.fullsrc,
        namespace: this.us.namespace(),
        email: this.us.user.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
