import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { JoueurService } from '../../services/joueur';
import { EquipeService } from '../../service/equipe-service';
import { Joueur } from '../../interface/joueur/joueur';
import { UserCreate } from '../../interface/user/user-create';
import { ReponseEquipe } from '../../interface/equipe/reponse-equipe';
import { JoueurFormDialogComponent } from '../../responsable/JoueurCard/joueur-form-dialog-component/joueur-form-dialog-component';
import { JoueurDeleteDialogComponent } from '../../responsable/JoueurCard/joueur-delete-dialog-component/joueur-delete-dialog-component';

@Component({
  selector: 'app-joueur-card',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './joueur-card.html',
  styleUrls: ['./joueur-card.css']
})
export class JoueurCardComponent implements OnInit {

  joueurs: Joueur[] = [];
  loading = false;
  error: string | null = null;
  selectedFile!: File;

  monEquipe!: ReponseEquipe;
  user!: UserCreate;
  erreurs: string[] = [];

joueursImportes: Joueur[] = [];


constructor(
  private joueurService: JoueurService,
  private equipeService: EquipeService,
  private dialog: MatDialog,
  private snackBar: MatSnackBar,
  private cdr: ChangeDetectorRef,
) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!this.user?.id) {
      this.error = 'Utilisateur non connecté';
      return;
    }


    this.equipeService.getByRespId(this.user.id).subscribe({
      next: (data) => {
        console.log("Equipe data:"+JSON.stringify(data));

        this.monEquipe = data;
        this.load();
      },
      error: () => {
        console.error("Erreur lors du chargement de l'équipe");
        this.error = "Impossible de charger l'équipe";

      }
    });
     this.load();
  }
onFileSelected(event: any) {

  const file: File = event.target.files[0];

  if (!file) return;

  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel'
  ];

  const isCsv =
    file.name.endsWith('.csv') ||
    allowedTypes.includes(file.type);

  if (!isCsv) {

    this.erreurs = [];

    this.erreurs.push(
      "❌ Format invalide. Veuillez importer un fichier CSV."
    );

    return;
  }


  const maxSize = 2 * 1024 * 1024; // 2MB

  if (file.size > maxSize) {

    this.erreurs = [];

    this.erreurs.push(
      "❌ Fichier trop volumineux (max 2MB)."
    );

    return;
  }

  this.selectedFile = file;

  this.joueurService.uploadCSV(file, this.monEquipe.id)
    .subscribe({

      next: (res) => {

        this.joueurs = res.joueurs;

        this.erreurs = res.erreurs;

        this.load();
        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(err);

        this.erreurs = err.error?.erreurs || [
          "Erreur serveur lors de l'import"
        ];
        this.cdr.detectChanges();
      }
    });
}

  load(): void {
    console.log("Chargement des joueurs pour l'équipe ID:", this.monEquipe?.id);
    if (!this.monEquipe?.id) return;

    this.loading = true;
    this.error = null;

    console.log("Appel à getByEquipe avec ID:", this.monEquipe.id);
    this.joueurService.getByEquipe(this.monEquipe.id).subscribe({
      next: (data) => {
        this.joueurs = data;
        console.log("Joueurs chargés:", JSON.stringify(data));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
          console.error("Erreur lors du chargement des joueurs");
        this.error = 'Impossible de charger les joueurs';
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    const dialogRef = this.dialog.open(JoueurFormDialogComponent, {
      width: '480px',
      panelClass: 'custom-dialog',
      data: {
        joueur: null,
        idEquipe: this.monEquipe?.id ?? null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.load();
        this.snackBar.open('Joueur créé avec succès', '✕', { duration: 300 });
      }
    });
  }

  openEditModal(j: Joueur): void {
    const dialogRef = this.dialog.open(JoueurFormDialogComponent, {
      width: '480px',
      panelClass: 'custom-dialog',
      data: {
        joueur: j,
        idEquipe: j.idEquipe
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.load();
        this.snackBar.open('Joueur modifié avec succès', '✕', { duration: 3000 });
      }
    });
  }

  confirmDelete(j: Joueur): void {
    const dialogRef = this.dialog.open(JoueurDeleteDialogComponent, {
      width: '380px',
      panelClass: 'custom-dialog',
      data: { joueur: j }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.load();
        this.snackBar.open('Joueur supprimé', '✕', { duration: 3000 });
      }
    });
  }

  getAge(dateNaiss: string): number | string {
    if (!dateNaiss) return '?';
    const today = new Date();
    const birth = new Date(dateNaiss);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return isNaN(age) ? '?' : age;
  }
}
