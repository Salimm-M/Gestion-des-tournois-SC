import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { JoueurService } from '../../services/joueur';
import { Joueur } from '../../interface/joueur/joueur';

type EventType = 'BUT' | 'JAUNE' | 'ROUGE';

interface EventDTO {
  matchId: number;
  joueurId: number;
  type: EventType;
  minute: number;
}

interface EventResponse {
  id: number;
  joueurId: number;
  joueurNom: string;
  equipeId: number;
  equipeNom: string;
  type: EventType;
  minute: number;
}

interface Equipe {
  id: number;
  nom: string;
}

interface MatchInfo {
  id: number;
  dateMatch: string;
  heureDebut: string;
  statut: string;
  equipeDomicile: Equipe;
  equipeExterieur: Equipe;
}

interface ModalState {
  open: boolean;
  joueur: Joueur | null;
  type: EventType | null;
}

interface DeleteModalState {
  open: boolean;
  event: EventResponse | null;
}

@Component({
  selector: 'app-match-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './match-dashboard.html',
  styleUrls: ['./match-dashboard.css']
})
export class MatchDashboardComponent implements OnInit, OnDestroy {

  private readonly API = 'http://localhost:8091/api';
  private destroy$ = new Subject<void>();

  matchId = 0;
  match: MatchInfo | null = null;
  matchLoading = false;

  joueursA: Joueur[] = [];
  joueursB: Joueur[] = [];
  loadingA = false;
  loadingB = false;
  private eventDelete: number | null = null;

  private _events$ = new BehaviorSubject<EventResponse[]>([]);
  events: EventResponse[] = [];
  loadingEvents = false;
  savingEvent = false;

  modal: ModalState = { open: false, joueur: null, type: null };
  deleteModal: DeleteModalState = { open: false, event: null };
  deletingEvent = false;

  form: FormGroup;

  successMsg = '';
  errorMsg = '';

  readonly icons: Record<EventType, string> = {
    BUT: '⚽',
    JAUNE: '🟨',
    ROUGE: '🟥'
  };

  readonly labels: Record<EventType, string> = {
    BUT: 'But',
    JAUNE: 'Carton Jaune',
    ROUGE: 'Carton Rouge'
  };

  readonly colors: Record<EventType, string> = {
    BUT: '#1d9e75',
    JAUNE: '#f59e0b',
    ROUGE: '#ef4444'
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private joueurService: JoueurService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      minute: [45, [Validators.required, Validators.min(0), Validators.max(120)]]
    });
  }

  ngOnInit(): void {
    this.matchId = +this.route.snapshot.paramMap.get('id')!;

    this._events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ev => {
        this.events = ev;
        this.cdr.markForCheck();
      });

    this.loadMatch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  hasRedBefore(joueurId: number, minute: number): boolean {
    return this.events.some(e =>
      e.joueurId === joueurId &&
      e.type === 'ROUGE' &&
      e.minute <= minute
    );
  }

  hasRed(joueurId: number): boolean {
    return this.events.some(e =>
      e.joueurId === joueurId && e.type === 'ROUGE'
    );
  }

  isPastMinute(minute: number): boolean {
    const last = Math.max(...this.events.map(e => e.minute), 0);
    return minute < last;
  }

 
  loadMatch(): void {
    this.matchLoading = true;

    this.http.get<MatchInfo>(`${this.API}/matches/${this.matchId}`).subscribe({
      next: (m) => {
        this.match = m;
        this.matchLoading = false;
        this.loadTeamPlayers();
        this.loadEvents();
        this.cdr.markForCheck();
      },
      error: () => {
        this.matchLoading = false;
        this.toast('error', 'Impossible de charger le match.');
        this.cdr.markForCheck();
      }
    });
  }

  
  loadTeamPlayers(): void {
    if (!this.match) return;

    this.loadingA = true;
    this.joueurService.getByEquipe(this.match.equipeDomicile.id).subscribe({
      next: (j) => { this.joueursA = j; this.loadingA = false; this.cdr.markForCheck(); },
      error: () => { this.loadingA = false; this.cdr.markForCheck(); }
    });

    this.loadingB = true;
    this.joueurService.getByEquipe(this.match.equipeExterieur.id).subscribe({
      next: (j) => { this.joueursB = j; this.loadingB = false; this.cdr.markForCheck(); },
      error: () => { this.loadingB = false; this.cdr.markForCheck(); }
    });
  }

 
  loadEvents(): void {
    this.loadingEvents = true;
    this.http.get<EventResponse[]>(`${this.API}/events/match/${this.matchId}`).subscribe({
      next: (ev) => {
        this._events$.next(this.sortedEvents(ev));
        this.loadingEvents = false;
        this.cdr.markForCheck();
      },
      error: () => { this.loadingEvents = false; this.cdr.markForCheck(); }
    });
  }

  confirmEvent(): void {
    if (this.form.invalid || !this.modal.joueur || !this.modal.type) return;

    const minute = +this.form.value.minute;
    const joueurId = this.modal.joueur.id;

    if (this.hasRedBefore(joueurId, minute)) {
      this.toast('error', 'joueur déjà expulsé avant cette minute');
      return;
    }

    if (this.modal.type === 'ROUGE' && this.hasRed(joueurId)) {
      this.toast('error', 'joueur déjà expulsé');
      return;
    }

    if (this.isPastMinute(minute)) {
      this.toast('error', '❌ vous ne pouvez pas ajouter un événement dans le passé');
      return;
    }

    const dto: EventDTO = {
      matchId: this.matchId,
      joueurId,
      type: this.modal.type,
      minute
    };

    this.savingEvent = true;

    this.http.post<EventResponse>(`${this.API}/events`, dto).subscribe({
      next: (event) => {
        const updated = this.sortedEvents([...this._events$.getValue(), event]);
        this._events$.next(updated);
        this.savingEvent = false;
        this.closeModal();
        this.toast('success', `${this.labels[dto.type]} enregistré à ${dto.minute}'`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        if(err.status === 403||err.status === 400||err.status<500){
          this.savingEvent = false;
          this.toast('error', 'Erreur lors de l\'enregistrement.');
          this.cdr.markForCheck();
        }else{
          this.savingEvent = false;
          this.loadEvents();
          this.closeModal();
          this.toast('success', `${this.labels[dto.type]} enregistré à ${dto.minute}'`);
          this.cdr.markForCheck();}
      }
    });
  }
  terminer(): void {
      this.http.post(`http://localhost:8091/api/events/${this.matchId}/terminer`, {}).subscribe({
        next: () => {
          console.log('Match terminé');},
        error: (err) => {
          this.toast('error', 'Erreur lors de la terminaison du match.');
          this.toast('error',err.error.message || 'match déjà terminé ');
          this.cdr.markForCheck();
         }
      }); 
    }
 
  
  
  openDeleteModal(event: EventResponse): void {
    this.deleteModal = { open: true, event };
    this.eventDelete = event.id;
    this.cdr.markForCheck();
  }

  closeDeleteModal(): void {
    this.deleteModal = { open: false, event: null };
    this.cdr.markForCheck();
  }

  confirmDelete(): void {
    if (!this.deleteModal.event) return;

    const ev = this.deleteModal.event;
    this.deletingEvent = true;

    this.http.delete(`${this.API}/events/${ev.id}`).subscribe({
      next: () => {
        const updated = this._events$.getValue().filter(e => e.id !== ev.id);
        this._events$.next(updated);
        this.deletingEvent = false;
        this.closeDeleteModal();
        this.toast('success', `${this.labels[ev.type]} annulé`);
        this.cdr.markForCheck();
      },
      error: () => {
        this.deletingEvent = false;
        this.toast('error', 'Erreur suppression');
        this.cdr.markForCheck();
      }
    });
  }

  openModal(joueur: Joueur, type: EventType): void {
    this.modal = { open: true, joueur, type };
    this.form.reset({ minute: 45 });
    this.cdr.markForCheck();
  }

  closeModal(): void {
    this.modal = { open: false, joueur: null, type: null };
    this.cdr.markForCheck();
  }

  // ======================
  // SCORE
  // ======================
  get scoreA(): number {
    return this.events.filter(
      e => e.type === 'BUT' && e.equipeId === this.match?.equipeDomicile?.id
    ).length;
  }

  get scoreB(): number {
    return this.events.filter(
      e => e.type === 'BUT' && e.equipeId === this.match?.equipeExterieur?.id
    ).length;
  }

  isHome(e: EventResponse): boolean {
    return e.equipeId === this.match?.equipeDomicile?.id;
  }


  private sortedEvents(ev: EventResponse[]): EventResponse[] {
    return [...ev].sort((a, b) => a.minute - b.minute);
  }

  initials(nom = ''): string {
    return nom.split(' ').map(w => w[0] ?? '').join('').substring(0, 2).toUpperCase();
  }

  toast(kind: 'success' | 'error', msg: string): void {
    if (kind === 'success') {
      this.successMsg = msg;
      setTimeout(() => { this.successMsg = ''; this.cdr.markForCheck(); }, 4000);
    } else {
      this.errorMsg = msg;
      setTimeout(() => { this.errorMsg = ''; this.cdr.markForCheck(); }, 5000);
    }
  }

  get modalColor(): string {
    return this.modal.type ? this.colors[this.modal.type] : '#4361ee';
  }

  get deleteEventColor(): string {
    return this.deleteModal.event ? this.colors[this.deleteModal.event.type] : '#ef4444';
  }
}