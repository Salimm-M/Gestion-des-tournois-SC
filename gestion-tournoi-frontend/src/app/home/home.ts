import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TournoiService } from '../service/tournoi-service';
import { TournoiDTO } from '../interface/tournoi';

type FilterKey = 'tous' | 'ouvert' | 'avenir' | 'encours';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  tournois: TournoiDTO[] = [];
  filtered: TournoiDTO[] = [];
  activeFilter: FilterKey = 'tous';
  loading = true;
  searchQuery = '';

  filters: { key: FilterKey; label: string }[] = [
    { key: 'tous',    label: 'Tous' },
    { key: 'ouvert',  label: 'Inscriptions ouvertes' },
    { key: 'avenir',  label: 'À venir' },
    { key: 'encours', label: 'En cours' },
  ];

  constructor(private tournoiService: TournoiService,private router: Router) {}

  ngOnInit(): void {
    this.tournoiService.getAll().subscribe({
      next: (data) => {
        console.log("Tournois data:", data);
        this.tournois = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

 
  get nbActifs(): number {
    return this.tournois.filter(t => t.statut === 'EN_COURS').length;
  }

  get nbOuverts(): number {
    return this.tournois.filter(t => t.ouvert).length;
  }

  get nbEquipes(): number {
    return this.tournois.reduce((acc, t) => acc + t.nbParticipations, 0);
  }

  get tournoiUne(): TournoiDTO | null {
    return this.tournois.find(t => t.ouvert) ?? null;
  }

  setFilter(key: FilterKey): void {
    this.activeFilter = key;
    this.applyFilter();
  }

  applyFilter(): void {
    let list = [...this.tournois];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(t => t.nom.toLowerCase().includes(q));
    }

    switch (this.activeFilter) {
      case 'ouvert':  list = list.filter(t => t.ouvert); break;
      case 'avenir':  list = list.filter(t => t.statut === 'BIENTOT'); break;
      case 'encours': list = list.filter(t => t.statut === 'EN_COURS'); break;
    }

    this.filtered = list;
  }

  onSearch(): void {
    this.applyFilter();
  }

  fillPercent(t: TournoiDTO): number {
    if (!t.nbEquipes) return 0;
    return Math.round((t.nbParticipations / t.nbEquipes) * 100);
  }

  placesRestantes(t: TournoiDTO): number {
    return t.nbEquipes - t.nbParticipations;
  }

  statutLabel(t: TournoiDTO): string {
    if (!t.ouvert && !t.estLance) return 'Complet';
    if (t.ouvert)                  return 'Ouvert';
    if (t.estLance)                return 'En cours';
    return 'À venir';
  }
  login():void{
  this.router.navigate(['/login']);
  }

  statutClass(t: TournoiDTO): string {
    if (!t.ouvert && !t.estLance) return 'tour-status status-full';
    if (t.ouvert)                  return 'tour-status status-open';
    if (t.estLance)                return 'tour-status status-progress';
    return 'tour-status status-soon';
  }

  headClass(t: TournoiDTO): string {
    return t.ouvert ? 'tour-head tour-head-open' : 'tour-head';
  }

  progFillColor(t: TournoiDTO): string {
    return this.fillPercent(t) >= 100 ? '#f87171' : '#D4A843';
  }
}
