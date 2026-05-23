import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StadeService } from '../../../service/stade';

@Component({
  selector: 'app-stade-delete-dialog-component',
  imports: [],
  templateUrl: './stade-delete-dialog-component.html',
  styleUrl: './stade-delete-dialog-component.css',
})
export class StadeDeleteDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<StadeDeleteDialogComponent>,
    private stadeService: StadeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirm() {
    this.stadeService.delete(this.data.stade.id).subscribe(() => {
      this.dialogRef.close('deleted');
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}