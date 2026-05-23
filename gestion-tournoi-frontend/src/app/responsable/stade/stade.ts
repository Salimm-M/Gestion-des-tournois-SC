import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreateStade, StadeResponse } from '../../stade';
import { StadeService } from '../../service/stade';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from "@angular/common";
import { StadeFormDialogComponent } from './stade-form-dialog-component/stade-form-dialog-component';
import { StadeDeleteDialogComponent } from './stade-delete-dialog-component/stade-delete-dialog-component';

@Component({
  selector: 'app-stade',
  imports: [NgIf],
  templateUrl: './stade.html',
  styleUrl: './stade.css',
})
export class StadeCardComponent implements OnInit {

  stades: StadeResponse[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private stadeService: StadeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    this.stadeService.getAll().subscribe({
      next: (data) => {
        this.stades = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur chargement';
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(StadeFormDialogComponent, {
      width: '480px',
      panelClass: 'custom-dialog',
      data: { stade: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.load();
        this.snackBar.open('Stade créé', '✕', { duration: 3000 });
      }
    });
  }

  openEditModal(s: StadeResponse): void {
    const dialogRef = this.dialog.open(StadeFormDialogComponent, {
      width: '480px',
      panelClass: 'custom-dialog',
      data: { stade: s }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.load();
        this.snackBar.open('Stade modifié', '✕', { duration: 3000 });
      }
    });
  }

  confirmDelete(s: StadeResponse): void {
    const dialogRef = this.dialog.open(StadeDeleteDialogComponent, {
      width: '360px',
      panelClass: 'custom-dialog',
      data: { stade: s }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.load();
        this.snackBar.open('Stade supprimé', '✕', { duration: 3000 });
      }
    });
  }
}