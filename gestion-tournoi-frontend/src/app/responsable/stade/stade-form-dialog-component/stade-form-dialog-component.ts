import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StadeService } from '../../../service/stade';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stade-form-dialog-component',
  imports: [NgIf, FormsModule],
  templateUrl: './stade-form-dialog-component.html',
  styleUrl: './stade-form-dialog-component.css',
})
export class StadeFormDialogComponent {

  form = {
    nom: '',
    ville: '',
    heureOuverture: '',
    heureFermeture: ''
  };

  saving = false;
  error: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<StadeFormDialogComponent>,
    private stadeService: StadeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.stade) {
      this.form = { ...data.stade };
    }
  }

  isHeureValid(): boolean {
    if (!this.form.heureOuverture || !this.form.heureFermeture) return true;
    return this.form.heureOuverture < this.form.heureFermeture;
  }

  submit(formRef: any) {
    if (formRef.invalid || !this.isHeureValid()) return;

    this.saving = true;

    const req = this.data.stade
      ? this.stadeService.update(this.data.stade.id, this.form)
      : this.stadeService.create(this.form);

    req.subscribe({
      next: () => this.dialogRef.close('saved'),
      error: () => {
        this.error = 'Erreur';
        this.saving = false;
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
