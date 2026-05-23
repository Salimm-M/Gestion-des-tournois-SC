import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { TournoiCreateDTO } from '../../../interface/tournoi';

@Component({
  selector: 'app-create-tournoi-dialog',
  templateUrl: './create-tournoi-dialog.html',
  styleUrls: ['./create-tournoi-dialog.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatIconModule, MatDialogModule]
})
export class CreateTournoiDialog {

  form: FormGroup;

  types = [
    { value: 'ELIMINATION', label: 'Élimination', css: 'chip-elim', icon: 'bolt' },
    { value: 'ROUND_ROBIN',       label: 'Ligue',       css: 'chip-ligue', icon: 'leaderboard' },
   
  ];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<CreateTournoiDialog>) {
    this.form = this.fb.group({
      nom:         ['', Validators.required],
      typeTournoi: ['', Validators.required],
      dateDebut:   ['', Validators.required],
      dateFin:     ['', Validators.required],
      nbEquipes:   [2, [Validators.required, Validators.min(2)]],
      nbJoueurSurTerrain: [5, [Validators.required, Validators.min(1)]]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(g: AbstractControl): ValidationErrors | null {
    const d = g.get('dateDebut')?.value;
    const f = g.get('dateFin')?.value;
    return d && f && new Date(f) <= new Date(d) ? { dateInvalide: true } : null;
  }

  selectType(value: string): void {
    this.form.get('typeTournoi')?.setValue(value);
    this.form.get('typeTournoi')?.markAsTouched();
  }
  isPowerOfTwo(n: number): boolean {
  return n > 1 && (n & (n - 1)) === 0;
}

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close(this.form.value as TournoiCreateDTO);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }
}