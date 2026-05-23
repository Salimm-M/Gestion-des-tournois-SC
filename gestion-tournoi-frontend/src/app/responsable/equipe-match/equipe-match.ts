import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatchService } from '../../service/match-service';
import { TournoiService } from '../../service/tournoi-service';
import { EquipeService } from '../../service/equipe-service';

import { Match } from '../../interface/match';
import { TournoiDTO } from '../../interface/tournoi';
import { UserCreate } from '../../interface/user/user-create';

export interface EquipeDTO {
  id: number;
  nom: string;
  logo?: string;
  abreviation?: string;
  couleurPrimaire?: string;
}

export interface MatchParJournee {
  journee: number;
  matches: Match[];
}

export interface StatsEquipe {
  mj: number;
  v: number;
  n: number;
  d: number;
  gf: number;
  ga: number;
  pts: number;
}

@Component({
  selector: 'app-matches-par-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './equipe-match.html',
  styleUrls: ['./equipe-match.css']
})
export class MatchesParEquipeComponent implements OnInit {

  equipes: EquipeDTO[] = [];
  tournois: TournoiDTO[] = [];

  selectedEquipeId: number | null = null;
  selectedTournoiId: number | null = null;

  selectedEquipe: EquipeDTO | null = null;

  matchesParJournee: MatchParJournee[] = [];

  stats: StatsEquipe = {
    mj: 0,
    v: 0,
    n: 0,
    d: 0,
    gf: 0,
    ga: 0,
    pts: 0
  };

  loading = false;
  error: string | null = null;

  user!: UserCreate;

  constructor(
    private matchService: MatchService,
    private tournoiService: TournoiService,
    private equipeService: EquipeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || 'null');

    this.loadTournois();
    this.loadEquipes();
  }

  loadEquipes(): void {
    this.equipeService.getByRespId(this.user.id).subscribe({
      next: (data) => {

        this.selectedEquipe = data;
        this.selectedEquipeId = data.id;

        this.loadMatches();

        this.cdr.markForCheck();
      },

      error: () => {
        this.error = 'Impossible de charger les équipes.';
      }
    });
  }

  loadTournois(): void {
    this.tournoiService.getAll().subscribe({
      next: (data) => {

        this.tournois = data;

        this.cdr.markForCheck();
      },

      error: () => {
        this.error = 'Impossible de charger les tournois.';
      }
    });
  }

  onSelectionChange(): void {

    if (!this.selectedEquipeId) {

      this.matchesParJournee = [];
      this.selectedEquipe = null;

      return;
    }

    this.selectedEquipe =
      this.equipes.find(e => e.id === this.selectedEquipeId)
      || this.selectedEquipe;

    this.loadMatches();

    this.cdr.markForCheck();
  }

  loadMatches(): void {

    console.log(
      'Loading matches for equipeId:',
      this.selectedEquipeId,
      'and tournoiId:',
      this.selectedTournoiId
    );

    if (!this.selectedEquipeId) return;

    this.loading = true;
    this.error = null;

    this.matchService
      .getMatchByEquipeAndTournoi(
        this.selectedTournoiId ?? 0,
        this.selectedEquipeId
      )
      .subscribe({

        next: (matches) => {

          console.log('Matches loaded:', matches);

          this.matchesParJournee = this.groupByJournee(matches);

          this.stats = this.calcStats(
            matches,
            this.selectedEquipeId!
          );

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.error = 'Erreur lors du chargement des matchs.';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  private groupByJournee(matches: Match[]): MatchParJournee[] {

    const map = new Map<number, Match[]>();

    matches.forEach(match => {

      if (!map.has(match.journee)) {
        map.set(match.journee, []);
      }

      map.get(match.journee)!.push(match);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a - b)
      .map(([journee, matches]) => ({
        journee,
        matches
      }));
  }

  private calcStats(
    matches: Match[],
    equipeId: number
  ): StatsEquipe {

    const played = matches.filter(
      m => m.statut === 'TERMINE'
    );

    let v = 0;
    let n = 0;
    let d = 0;
    let gf = 0;
    let ga = 0;

    played.forEach(match => {

      const isDom =
        match.equipeDomicile.id === equipeId;

      const myScore = isDom
        ? match.scoreDomicile
        : match.scoreExterieur;

      const oppScore = isDom
        ? match.scoreExterieur
        : match.scoreDomicile;

      gf += myScore;
      ga += oppScore;

      if (myScore > oppScore) {
        v++;
      }
      else if (myScore < oppScore) {
        d++;
      }
      else {
        n++;
      }
    });

    return {
      mj: played.length,
      v,
      n,
      d,
      gf,
      ga,
      pts: (v * 3) + n
    };
  }

  getResult(match: Match): 'V' | 'N' | 'D' | '-' {

    if (
      match.statut !== 'TERMINE'
      || !this.selectedEquipeId
    ) {
      return '-';
    }

    const isDom =
      match.equipeDomicile.id === this.selectedEquipeId;

    const myScore = isDom
      ? match.scoreDomicile
      : match.scoreExterieur;

    const oppScore = isDom
      ? match.scoreExterieur
      : match.scoreDomicile;

    if (myScore > oppScore) return 'V';

    if (myScore < oppScore) return 'D';

    return 'N';
  }

  getScoreDisplay(match: Match): string {

    if (match.statut === 'PLANIFIE') {
      return 'vs';
    }

    return `${match.scoreDomicile} — ${match.scoreExterieur}`;
  }

  getInitials(nom: string): string {

    return nom
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 3)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }

  getTournoiLabel(): string {

    if (!this.selectedTournoiId) {
      return 'Toutes compétitions';
    }

    return this.tournois.find(
      t => t.id === this.selectedTournoiId
    )?.nom || '—';
  }
}