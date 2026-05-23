import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TournoiDTO } from '../../../interface/tournoi';

@Component({
  selector: 'app-update-tournoi-dialog',
  templateUrl: './update-tournoi-dialog.html',
  styleUrls: ['./update-tournoi-dialog.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatIconModule, MatDialogModule]
})
export class UpdateTournoiDialog {

  form: FormGroup;

  types = [
    { value: 'ELIMINATION', label: 'Élimination', css: 'chip-elim',   icon: 'bolt' },
    { value: 'ROUND_ROBIN',       label: 'Ligue',       css: 'chip-ligue',  icon: 'leaderboard' },
   
  ];

  statuts = [
    { value: 'EN_ATTENTE', label: 'En attente', css: 'chip-att' },
    { value: 'EN_COURS',   label: 'En cours',   css: 'chip-cours' },
    { value: 'COMPLET',    label: 'Complet',     css: 'chip-comp' },
    { value: 'TERMINE',    label: 'Terminé',     css: 'chip-term' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateTournoiDialog>,
    @Inject(MAT_DIALOG_DATA) public data: TournoiDTO
  ) {
    this.form = this.fb.group({
      nom:         [data.nom,         Validators.required],
      typeTournoi: [data.typeTournoi, Validators.required],
      dateDebut:   [data.dateDebut,   Validators.required],
      dateFin:     [data.dateFin,     Validators.required],
      nbEquipes:   [data.nbEquipes,   [Validators.required, Validators.min(2)]],
      statut:      [data.statut,      Validators.required],
      ouvert:      [data.ouvert],
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(g: AbstractControl): ValidationErrors | null {
    const d = g.get('dateDebut')?.value;
    const f = g.get('dateFin')?.value;
    return d && f && new Date(f) <= new Date(d) ? { dateInvalide: true } : null;
  }

  selectType(value: string): void   { this.form.get('typeTournoi')?.setValue(value); }
  selectStatut(value: string): void { this.form.get('statut')?.setValue(value); }
  toggleOuvert(): void {
    const current = this.form.get('ouvert')?.value;
    this.form.get('ouvert')?.setValue(!current);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close({ ...this.data, ...this.form.value });
  }

  onCancel(): void { this.dialogRef.close(null); }
}