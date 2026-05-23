import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../service/match-service';
import { Match } from '../../interface/match';
import { Router } from '@angular/router';
import { TournoiService } from '../../service/tournoi-service';
import { TournoiDTO } from '../../interface/tournoi';

@Component({
  selector: 'app-liste-matchs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-matchs.html',
  styleUrls: ['./liste-matchs.css']
})
export class ListeMatchst implements OnInit {

  allMatches: Match[] = [];
  allTournois: TournoiDTO[] = [];
  tournoiId: number = 1;

  filterJournee: number | null = null;
  filterStatut: string = '';

  loadingMatches = false;
  generating = false;
  successMsg = '';
  errorMsg = '';

  constructor(private matchService: MatchService, private router: Router,private cdr: ChangeDetectorRef,private tournoiService: TournoiService) {}

  ngOnInit(): void {
    this.loadMatches();
    this.loadTournois();
  }
  loadTournois(): void {
  
    this.tournoiService.getAll().subscribe({
      next: (data) => {
        this.allTournois = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showError('Impossible de charger les tournois.');
      }
    });
  }
  score(id: number): void {
    this.router.navigate(['/admin/score', id]);
  }
 

  loadMatches(): void {
      if(!this.tournoiId){
      this.showError('Veuillez sélectionner un tournoi.');
      return;
    }
    this.loadingMatches = true;
    this.matchService.getMatchesByTournoi(this.tournoiId).subscribe({
      next: (data) => {
        this.allMatches = data;
        this.loadingMatches = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.showError('Impossible de charger les matchs.');
        this.loadingMatches = false;
      }
    });
  }

  genererMatchs(): void {
    this.generating = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.matchService.genererMatchs(this.tournoiId).subscribe({
      next: () => {
        this.generating = false;
        this.showSuccess('Matchs générés avec succès !');
        this.loadMatches();
      },
      error: () => {
        this.generating = false;
        this.showError('Erreur lors de la génération des matchs.');
      }
    });
  }

  get filteredMatches(): Match[] {
    return this.allMatches.filter(m => {
      const okJournee = this.filterJournee ? m.journee === this.filterJournee : true;
      const okStatut  = this.filterStatut  ? m.statut === this.filterStatut   : true;
      return okJournee && okStatut;
    });
  }

  get journees(): number[] {
    return [...new Set(this.allMatches.map(m => m.journee))].sort((a, b) => a - b);
  }

  planifierMatch(id:number): void {
    this.router.navigate(['/admin/planifier', id]);
   
  }

  statutLabel(statut: string): string {
    const map: Record<string, string> = {
      PLANIFIE: 'Planifié',
      EN_COURS: 'En cours',
      TERMINE:  'Terminé',
      REPORTE:  'Reporté',
      ANNULE:   'Annulé'
    };
    return map[statut] ?? statut;
  }

  formatDate(d: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  showSuccess(msg: string): void {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => this.successMsg = '', 4000);
  }

  showError(msg: string): void {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => this.errorMsg = '', 5000);
  }
  // Ajouter ces méthodes dans la classe ListeMatchst

get journeesFiltered(): number[] {
  return [...new Set(this.filteredMatches.map(m => m.journee))].sort((a, b) => a - b);
}

getMatchesByJournee(j: number): Match[] {
  return this.filteredMatches.filter(m => m.journee === j);
}

initials(nom: string | undefined): string {
  if (!nom) return '?';
  return nom.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

statutClass(statut: string): string {
  const map: Record<string, string> = {
    PLANIFIE: 'badge-planifie',
    EN_COURS: 'badge-encours',
    TERMINE:  'badge-termine',
    REPORTE:  'badge-reporte',
    ANNULE:   'badge-annule'
  };
  return map[statut] ?? 'badge-planifie';
}
countByStatut(s: string): number {
  return this.allMatches.filter(m => m.statut === s).length;
}

isLoser(m: Match, side: 'dom' | 'ext'): boolean {
  if (m.statut === 'PLANIFIE' || m.statut === 'EN_COURS') return false;
  if (side === 'dom') return m.scoreDomicile < m.scoreExterieur;
  return m.scoreExterieur < m.scoreDomicile;
}

private readonly COLORS = [
  { bg: '#e6f1fb', color: '#0c447c' },
  { bg: '#e1f5ee', color: '#085041' },
  { bg: '#faeeda', color: '#633806' },
  { bg: '#eeedfe', color: '#3c3489' },
  { bg: '#fbeaf0', color: '#72243e' },
  { bg: '#faece7', color: '#712b13' },
];
avatarBg(nom: string | undefined): string {
  const i = (nom?.charCodeAt(0) ?? 0) % this.COLORS.length;
  return this.COLORS[i].bg;
}
avatarColor(nom: string | undefined): string {
  const i = (nom?.charCodeAt(0) ?? 0) % this.COLORS.length;
  return this.COLORS[i].color;
}
}