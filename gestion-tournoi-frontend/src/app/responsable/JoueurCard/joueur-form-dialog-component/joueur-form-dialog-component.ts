import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { JoueurService } from '../../../services/joueur';
import { CreateJoueurDTO } from '../../../interface/joueur/create-joueur-dto';
import { Joueur } from '../../../interface/joueur/joueur';

export interface JoueurDialogData {
  joueur: Joueur | null;
  idEquipe: number | null;
}

@Component({
  selector: 'app-joueur-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './joueur-form-dialog-component.html',
  styleUrls: ['./joueur-form-dialog-component.css']
})
export class JoueurFormDialogComponent implements OnInit {

  saving = false;

  postes = [
    'Gardien', 'Défenseur central', 'Arriere gauche', 'Arriere droit',
    'Milieu défensif', 'Milieu central', 'Milieu offensif',
    'Ailier gauche', 'Ailier droit', 'Avant-centre', 'Attaquant'
  ];

  form: CreateJoueurDTO = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    poste: '',
    idEquipe: null
  };

  constructor(
    public dialogRef: MatDialogRef<JoueurFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: JoueurDialogData,
    private joueurService: JoueurService
  ) {}

  ngOnInit(): void {

    if (this.data.joueur) {

      const j = this.data.joueur;

      this.form = {
        nom: j.nom,
        prenom: j.prenom,
        dateNaiss: j.dateNaiss,
        poste: j.poste,
        idEquipe: j.idEquipe
      };

    } else {

      this.form.idEquipe = this.data.idEquipe;
    }
  }

  // ✅ CALCUL AGE
  getAge(date: string): number {

    if (!date) return 0;

    const birth = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const m = today.getMonth() - birth.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  get ageError(): boolean {

    if (!this.form.dateNaiss) return false;

    const age = this.getAge(this.form.dateNaiss);

    return age < 6 || age > 12;
  }

  submit(form: NgForm): void {

    if (form.invalid || this.ageError) return;

    this.saving = true;

    const req$ = this.data.joueur
      ? this.joueurService.update(this.data.joueur.id, this.form)
      : this.joueurService.create(this.form);

    req$.subscribe({

      next: () => {

        this.saving = false;

        this.dialogRef.close('saved');
      },

      error: () => {

        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}