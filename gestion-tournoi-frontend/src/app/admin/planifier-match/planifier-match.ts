import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../service/match-service';
import { StadeService } from '../../service/stade';
import { StadeResponse } from '../../stade';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchPlanifie } from '../../interface/match';

@Component({
  selector: 'app-planifier-match',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planifier-match.html',
  styleUrls: ['./planifier-match.css']
})
export class PlanifierMatchComponent implements OnInit {

  stades: StadeResponse[] = [];
  availableSlots: string[] = [];

  selectedStadeId: number | null = null;
  selectedDate: string = '';
  selectedSlot: string | null = null;
  matchId: number | null = null;
  loadingSlots = false;
  successMsg = '';
  errorMsg = '';
  
  constructor(
    private matchService: MatchService,
    private stadeService: StadeService,
    private route: ActivatedRoute,
    private router:Router,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStades();
    this.route.params.subscribe(params => {
      this.matchId = +params['id'];
    });
  }

  loadStades(): void {
    this.stadeService.getAll().subscribe({
      next: (data) => {
        this.stades = data;
        this.cdr.detectChanges();
        console.log("Stades chargés:" +this.stades[0].nom);
      },
      error: () => this.showError('Impossible de charger les stades.')
    });
  }

  onSelectionChange(): void {
    this.selectedSlot = null;
    this.availableSlots = [];
    if (this.selectedStadeId && this.selectedDate) {
      this.loadSlots();
    }
  }

  loadSlots(): void {
    this.loadingSlots = true;
    this.matchService.getAvailableSlots(this.selectedStadeId!, this.selectedDate).subscribe({
      next: (slots) => {
        this.availableSlots = slots.map(s => s.substring(0, 5));
        this.loadingSlots = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showError('Erreur lors du chargement des créneaux.');
        this.loadingSlots = false;
      }
    });
  }

  isAvailable(slot: string): boolean {
    return this.availableSlots.includes(slot);
  }

  selectSlot(slot: string): void {
    if (!this.isAvailable(slot)) return;
    this.selectedSlot = this.selectedSlot === slot ? null : slot;
  }

  slotEnd(start: string): string {
    const [h, m] = start.split(':').map(Number);
    const totalMin = h * 60 + m + 120;
    const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
    const endM = String(totalMin % 60).padStart(2, '0');
    return `${endH}:${endM}`;
  }

  get formValid(): boolean {
    return !!this.selectedStadeId && !!this.selectedDate && !!this.selectedSlot;
  }

  get selectedStadeName(): string {
    return this.stades.find(s => s.id === +this.selectedStadeId!)?.nom ?? '—';
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
  Planifier(): void {
    if (!this.formValid || !this.matchId) return;
    const matchPlanifie: MatchPlanifie = {
      idMatch: this.matchId,
      dateMatch: this.selectedDate,
      heureDebut: this.selectedSlot!,
      stadeId: +this.selectedStadeId!
    };
    console.log("Match à planifier:"+JSON.stringify(matchPlanifie));
    this.matchService.planifierMatch(matchPlanifie).subscribe({
      next: () => { this.showSuccess('Match planifié avec succès !');
        console.log("Match planifié:::"+JSON.stringify(matchPlanifie));
        this.router.navigate(['/admin/match']);
       },
      error: () => this.showError('Erreur lors de la planification du match.')
    });
  }
}