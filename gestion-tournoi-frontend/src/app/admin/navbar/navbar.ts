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
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  navItems: NavItem[] = [
    { label: 'Tableau de bord', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Tournois', icon: 'emoji_events',  route: '/admin/tournois' },
    { label: 'Stades',   icon: 'stadium',        route: '/admin/stade'    },
    { label: 'Matchs',   icon: 'sports_soccer',  route: '/admin/match'    },
    { label: 'Classements',   icon: 'leaderboard',  route: '/admin/classement'    },
  ];
}