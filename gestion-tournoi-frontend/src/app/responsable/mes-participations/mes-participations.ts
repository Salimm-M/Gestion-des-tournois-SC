import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, NgClass } from '@angular/common';
import { ParticipationService } from '../../service/participation-service';
import { ParticipationDTO } from '../../interface/participation-dto';
import { EquipeService } from '../../service/equipe-service';

@Component({
  selector: 'app-mes-participations',
  templateUrl: './mes-participations.html',
  styleUrls: ['./mes-participations.css'],
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, DatePipe, NgClass]
})
export class MesParticipations implements OnInit {

  equipeId = 1; 
  participations: ParticipationDTO[] = [];
  loading = false;
  userId!: number;

  constructor(private participationService: ParticipationService,private equipeService: EquipeService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.userId = JSON.parse(localStorage.getItem('user') || 'null')?.id;
    if (!this.userId) {
      console.error("Utilisateur non connecté");
      return;
    }
    this.equipeService.getByRespId(this.userId).subscribe({
      next: (data) => {
        console.log("Equipe data:"+JSON.stringify(data));
        this.equipeId = data.id;
        this.load(); 
      },
      error: () => {
        console.error("Erreur lors du chargement de l'équipe");
        this.loading = false;
      }
    });

    this.load(); }
   

  load(): void {
    this.loading = true;
    this.participationService.getMesParticipations(this.equipeId).subscribe({
      next: data => { this.participations = data; this.loading = false;
        this.cdr.markForCheck();
       },
      error: ()  => { this.loading = false; }
    });
  }

  quitter(participationId: number): void {
    if (confirm('Êtes-vous sûr de vouloir quitter ce tournoi ?')) {
      this.participationService.quitter(participationId).subscribe(() => this.load());
    }
  }

  getTypeCss(type: string): string {
    return ({ ELIMINATION: 'type-elim', LIGUE: 'type-ligue', AMICAL: 'type-amical' })[type] || '';
  }

  getStatutCss(statut: string): string {
    return ({ EN_ATTENTE: 'stat-att', EN_COURS: 'stat-cours', COMPLET: 'stat-comp', TERMINE: 'stat-term' })[statut] || '';
  }

  getStatutLabel(statut: string): string {
    return ({ EN_ATTENTE: 'En attente', EN_COURS: 'En cours', COMPLET: 'Complet', TERMINE: 'Terminé' })[statut] || statut;
  }
}