import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(
    private router: Router
  ) {}

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigate(['/login']);
  }

  navItems: NavItem[] = [

    {
      label: 'Mon Équipe',
      icon: 'groups',
      route: '/responsable/joueur'
    },

    {
      label: 'Mes Participations',
      icon: 'edit_note',
      route: '/responsable/mes-participations'
    },

    {
      label: 'Tournois',
      icon: 'emoji_events',
      route: '/responsable/tournoi'
    },

    {
      label: 'Mes Matchs',
      icon: 'sports_soccer',
      route: '/responsable/equipe-match'
    },

    {
      label: 'Classement',
      icon: 'leaderboard',
      route: '/responsable/classement'
    },

 
  ];
}