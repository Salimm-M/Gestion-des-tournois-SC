import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ParticipationService } from '../../service/participation-service';
import { TournoiService } from '../../service/tournoi-service';
import { EquipeService } from '../../service/equipe-service';

import { ClassementDTO } from '../../interface/participation-dto';
import { TournoiDTO } from '../../interface/tournoi';
import { UserCreate } from '../../interface/user/user-create';

export interface EquipeDTO {
  id: number;
  nom: string;
  logo?: string;
}

@Component({
  selector: 'app-classement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classement-equipe.html',
  styleUrls: ['./classement-equipe.css']
})
export class ClassementEquipeComponent
  implements OnInit {

  tournois: TournoiDTO[] = [];
  classement: ClassementDTO[] = [];

  selectedTournoiId: number | null = null;
  selectedTournoi: TournoiDTO | null = null;

  idEquipeEnValeur: number | null = null;

  myRow: ClassementDTO | null = null;
  myRank: number | null = null;

  loading = false;
  error: string | null = null;

  user!: UserCreate;

  readonly QUALIFY_COUNT = 2;
  readonly RELEGATE_COUNT = 2;

  constructor(
    private participationService: ParticipationService,
    private tournoiService: TournoiService,
    private equipeService: EquipeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.user = JSON.parse(
      localStorage.getItem('user') || 'null'
    );

    this.loadMyEquipe();

    this.loadTournois();
  }

  loadMyEquipe(): void {

    this.equipeService
      .getByRespId(this.user.id)
      .subscribe({

        next: (equipe: EquipeDTO) => {

          this.idEquipeEnValeur = equipe.id;

          this.computeMyRow();

          this.cdr.detectChanges();
        },

        error: () => {

          this.error =
            'Impossible de charger votre équipe.';

          this.cdr.detectChanges();
        }
      });
  }

  loadTournois(): void {

    this.tournoiService.getAll().subscribe({

      next: (data) => {

        this.tournois = data;

        this.cdr.detectChanges();
      },

      error: () => {

        this.error =
          'Impossible de charger les tournois.';

        this.cdr.detectChanges();
      }
    });
  }

  onTournoiChange(): void {

    if (!this.selectedTournoiId) {

      this.classement = [];
      this.selectedTournoi = null;
      this.myRow = null;
      this.myRank = null;

      this.cdr.detectChanges();

      return;
    }

    this.selectedTournoi =
      this.tournois.find(
        t => t.id === this.selectedTournoiId
      ) || null;

    this.loadClassement();

    this.cdr.markForCheck();
  }

  loadClassement(): void {

    if (!this.selectedTournoiId) return;

    this.loading = true;
    this.error = null;

    this.cdr.detectChanges();

    this.participationService
      .getClassement(this.selectedTournoiId)
      .subscribe({

        next: (data) => {

          this.classement = data.sort(
            (a, b) =>
              b.points - a.points ||
              b.differenceButs - a.differenceButs ||
              b.butsMarques - a.butsMarques
          );

          this.computeMyRow();

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err) => {

          console.error(err);

          this.error =
            'Erreur lors du chargement du classement.';

          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  private computeMyRow(): void {

    if (
      !this.idEquipeEnValeur ||
      this.classement.length === 0
    ) {

      this.myRow = null;
      this.myRank = null;

      return;
    }

    const idx = this.classement.findIndex(
      row => row.equipeId === this.idEquipeEnValeur
    );

    this.myRow =
      idx !== -1
        ? this.classement[idx]
        : null;

    this.myRank =
      idx !== -1
        ? idx + 1
        : null;
  }

  getRank(index: number): number {

    return index + 1;
  }

  isMyTeam(row: ClassementDTO): boolean {

    return (
      !!this.idEquipeEnValeur &&
      row.equipeId === this.idEquipeEnValeur
    );
  }

  isQualification(index: number): boolean {

    return (
      index < this.QUALIFY_COUNT &&
      !this.isMyTeam(this.classement[index])
    );
  }

  isRelegation(index: number): boolean {

    return (
      this.classement.length > 4 &&
      index >=
        this.classement.length - this.RELEGATE_COUNT &&
      !this.isMyTeam(this.classement[index])
    );
  }

  getMatchesJoues(row: ClassementDTO): number {

    return (
      row.nbVictoires +
      row.nbNuls +
      row.nbDefaites
    );
  }

  getDiffClass(diff: number): string {

    if (diff > 0) return 'pos';

    if (diff < 0) return 'neg';

    return 'zero';
  }

  getDiffStr(diff: number): string {

    return diff > 0
      ? `+${diff}`
      : String(diff);
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
}