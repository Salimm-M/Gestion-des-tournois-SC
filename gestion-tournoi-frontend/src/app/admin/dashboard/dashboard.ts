import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { EquipeService } from '../../service/equipe-service';
import { TournoiService } from '../../service/tournoi-service';
import { JoueurService } from '../../services/joueur';
import { ParticipationService } from '../../service/participation-service';
import { TournoiDTO } from '../../interface/tournoi';
import { ReponseEquipe } from '../../interface/equipe/reponse-equipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  loading = true;

  totalEquipes   = 0;
  totalTournois  = 0;
  totalJoueurs   = 0;
  tournoiActifs  = 0;


  recentTournois: TournoiDTO[]    = [];
  recentEquipes:  ReponseEquipe[] = [];


  today = new Date().toLocaleDateString('fr-TN', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  readonly quickActions = [
    { label: 'Gérer les tournois', sub: 'Créer, modifier, lancer',  icon: '🏆', bg: '#eef1fd', route: '/admin/tournois' },
    { label: 'Gérer les stades',   sub: 'Ajouter, consulter',        icon: '🏟️', bg: '#faeeda', route: '/admin/stade'    },
    { label: 'Liste des matchs',   sub: 'Planifier, scores, live',   icon: '⚽', bg: '#eaf3de', route: '/admin/match'    },
    { label: 'Classement',         sub: 'Points, buts, forme',       icon: '🏅', bg: '#fcebeb', route: '/admin/classement'},
  ];

  private readonly PALETTE = [
    '#4361ee','#ef4444','#1d9e75','#f59e0b',
    '#8b5cf6','#06b6d4','#ec4899','#f97316'
  ];

  constructor(
    private equipeService:       EquipeService,
    private tournoiService:      TournoiService,
    private joueurService:       JoueurService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    forkJoin({
      equipes:  this.equipeService.getAll().pipe(catchError(() => of([]))),
      tournois: this.tournoiService.getAll().pipe(catchError(() => of([]))),
      joueurs:  this.joueurService.getAll().pipe(catchError(() => of([]))),
    }).subscribe(({ equipes, tournois, joueurs }) => {
      this.totalEquipes  = equipes.length;
      this.totalTournois = tournois.length;
      this.totalJoueurs  = joueurs.length;
      this.tournoiActifs = tournois.filter(t =>
        t.statut === 'EN_COURS' || t.statut === 'LANCE'
      ).length;
      this.recentTournois = tournois.slice(0, 5);
      this.recentEquipes  = equipes.slice(0, 4);
      this.cdr.markForCheck();
      this.loading = false;
    });
  }


  statutClass(s: string): string {
    const m: Record<string, string> = {
      EN_ATTENTE: 'b-att', EN_COURS: 'b-crs',
      LANCE: 'b-crs', TERMINE: 'b-ter',
      COMPLET: 'b-com', ANNULE: 'b-ann'
    };
    return m[s] ?? 'b-att';
  }

  statutLabel(s: string): string {
    const m: Record<string, string> = {
      EN_ATTENTE: 'En attente', EN_COURS: 'En cours',
      LANCE: 'Lancé', TERMINE: 'Terminé',
      COMPLET: 'Complet', ANNULE: 'Annulé'
    };
    return m[s] ?? s;
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-TN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  initials(nom = ''): string {
    return nom.split(' ').map(w => w[0] ?? '').join('').substring(0, 2).toUpperCase();
  }

  avatarBg(nom = ''): string {
    return this.PALETTE[(nom.charCodeAt(0) ?? 0) % this.PALETTE.length];
  }
}