import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TournoiService } from '../../service/tournoi-service';
import { TournoiDTO } from '../../interface/tournoi';
import { ParticipationService } from '../../service/participation-service';
import { ClassementDTO } from '../../interface/participation-dto';



@Component({
  selector: 'app-classement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classement.html',
  styleUrls: ['./classement.css']
})
export class Classement implements OnInit {
  

  tournois: TournoiDTO[]    = [];
  classement: ClassementDTO[] = [];

  selectedTournoiId: number | null = null;
  loading   = false;
  loadingT  = false;
  errorMsg  = '';

  constructor(
    private http: HttpClient,
    private tournoiService: TournoiService,
    private participationService: ParticipationService,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTournois();
  }

  loadTournois(): void {
    this.loadingT = true;
    this.tournoiService.getAll().subscribe({
      next: (data) => {
        this.tournois = data;
        this.loadingT = false;
        this.cdr.detectChanges();
        if (data.length > 0) {
          this.selectedTournoiId = data[0].id;
          this.loadClassement();
        }
      },
      error: () => {
        this.loadingT = false;
        this.errorMsg = 'Impossible de charger les tournois.';
      }
    });
  }

  loadClassement(): void {
    if (!this.selectedTournoiId) return;
    this.loading = true;
    this.classement = [];
    this.errorMsg = '';

    this.participationService.getClassement(this.selectedTournoiId)
      .subscribe({
        next: (data) => {
          this.classement = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Impossible de charger le classement.';
        }
      });
  }

  onTournoiChange(): void {
    this.loadClassement();
  }


  joues(row: ClassementDTO): number {
    return row.nbVictoires + row.nbNuls + row.nbDefaites;
  }


  zoneClass(rank: number): string {
    const total = this.classement.length;
    if (rank <= 1)              return 'zone-gold';
    if (rank <= 3)              return 'zone-top';
    if (rank >= total - 1)      return 'zone-rel';
    return '';
  }

 
  initials(nom: string = ''): string {
    return nom.split(' ').map(w => w[0] ?? '').join('').substring(0, 2).toUpperCase();
  }

  
  private PALETTE = [
    '#4361ee','#ef4444','#1d9e75','#f59e0b',
    '#8b5cf6','#06b6d4','#ec4899','#f97316'
  ];
  avatarBg(nom: string = ''): string {
    return this.PALETTE[(nom.charCodeAt(0) ?? 0) % this.PALETTE.length];
  }

  get selectedTournoiNom(): string {
    return this.tournois.find(t => t.id === this.selectedTournoiId)?.nom ?? '';
  }
}