import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass, DatePipe } from '@angular/common';
import { TournoiService } from '../../service/tournoi-service';
import { TournoiDTO } from '../../interface/tournoi';
import { CreateTournoiDialog } from '../GestionTournoi/create-tournoi-dialog/create-tournoi-dialog';
import { UpdateTournoiDialog } from '../GestionTournoi/update-tournoi-dialog/update-tournoi-dialog';

@Component({
  selector: 'app-gestion-tournoi',
  templateUrl: './gestion-tournoi.html',
  styleUrls: ['./gestion-tournoi.css'],
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
  ]
})
export class GestionTournoi implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'nom', 'typeTournoi', 'dateDebut', 'dateFin',
    'nbEquipes', 'nbParticipations', 'statut', 'ouvert', 'actions'
  ];
  dataSource!: MatTableDataSource<TournoiDTO>;

  constructor(private tournoiService: TournoiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadTournois();
  }

  loadTournois(): void {
    this.tournoiService.getAll().subscribe(data => {
      this.dataSource = new MatTableDataSource<TournoiDTO>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filter: HTMLInputElement): void {
    this.dataSource.filter = filter.value.trim().toLowerCase();
  }

  getStatutClass(statut: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'badge-attente',
      EN_COURS:   'badge-cours',
      COMPLET:    'badge-complet',
      TERMINE:    'badge-termine',
    };
    return map[statut] || '';
  }

  getStatutLabel(statut: string): string {
    const map: Record<string, string> = {
      EN_ATTENTE: 'En attente',
      EN_COURS:   'En cours',
      COMPLET:    'Complet',
      TERMINE:    'Terminé',
    };
    return map[statut] || statut;
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CreateTournoiDialog, {   width: '520px',
    panelClass: 'modern-dialog',
    disableClose: false });
    ref.afterClosed().subscribe(result => {
      if (result) this.tournoiService.create(result).subscribe(() => this.loadTournois());
    });
  }

  openUpdateDialog(tournoi: TournoiDTO): void {
    const ref = this.dialog.open(UpdateTournoiDialog, {  width: '520px',
    panelClass: 'modern-dialog',
    disableClose: false , data: { ...tournoi } });
    ref.afterClosed().subscribe(result => {
      if (result) this.tournoiService.update(result.id, result).subscribe(() => this.loadTournois());
    });
  }

  lancerTournoi(id: number): void {
    if (confirm('Lancer ce tournoi ?')) {
      this.tournoiService.lancerTournoi(id).subscribe(() => this.loadTournois());
    }
  }

  deleteTournoi(id: number): void {
    if (confirm('Supprimer ce tournoi ?')) {
      this.tournoiService.delete(id).subscribe(() => this.loadTournois());
    }
  }
}