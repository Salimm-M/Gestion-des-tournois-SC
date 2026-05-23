import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { JoueurService } from '../../../services/joueur';
import { Joueur } from '../../../interface/joueur/joueur';

@Component({
  selector: 'app-joueur-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './joueur-delete-dialog-component.html',
  styleUrls: ['./joueur-delete-dialog-component.css']
})
export class JoueurDeleteDialogComponent {

  saving = false;

  constructor(
    public dialogRef: MatDialogRef<JoueurDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { joueur: Joueur },
    private joueurService: JoueurService
  ) {}

  confirm(): void {
    this.saving = true;
    this.joueurService.delete(this.data.joueur.id).subscribe({
      next: () => {
        this.saving = false;
        this.dialogRef.close('deleted');
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