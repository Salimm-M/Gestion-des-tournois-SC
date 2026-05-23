import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe, NgClass } from '@angular/common';
import { ParticipationService } from '../../service/participation-service';
import { TournoiDTO } from '../../interface/tournoi';
import { EquipeService } from '../../service/equipe-service';
import { UserCreate } from '../../interface/user/user-create';

@Component({
  selector: 'app-tournois-disponibles',
  templateUrl: './tournois-disponible.html',
  styleUrls: ['./tournois-disponible.css'],
  standalone: true,
  imports: [MatIconModule, MatProgressSpinnerModule, DatePipe, NgClass]
})
export class TournoisDisponibles implements OnInit {

  equipeId = 1;
  disponibles: TournoiDTO[] = [];
  loading = false;
  joining: number | null = null;
  error: string | null = null;
  

  constructor(private participationService: ParticipationService,private equipeService: EquipeService,private cdr: ChangeDetectorRef ) {}
user!:UserCreate;
  ngOnInit(): void { 
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
    const userId = this.user?.id;
    if (!userId) {
      console.error("Utilisateur non connecté");
      return;
    }
    this.equipeService.getByRespId(userId).subscribe({
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
    console.log("Chargement des tournois disponibles pour l'équipe "+this.equipeId);
    this.loading = true;
    this.participationService.getDisponibles(this.equipeId).subscribe({
      next: data => {console.log("Tournois disponibles reçus: "+JSON.stringify(data));
         this.disponibles = data; this.loading = false; 
        this.cdr.markForCheck();},
      error: ()  => { this.loading = false;
          console.error("Erreur lors du chargement des tournois disponibles");
       }
    });
  }

  rejoindre(tournoiId: number,nb:number): void {
    this.joining = tournoiId;
    this.participationService.rejoindre(this.equipeId, tournoiId).subscribe({
      next: () => { this.joining = null; this.load(); },
      error: (err) => { 
      
          console.log("errer")
          this.error="nombre de joueur invalide au mois vous devrez avoir "+nb+ "joueur"
         this.cdr.detectChanges()

       }
    });
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