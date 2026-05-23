import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { UserService } from '../../service/user-service';
import { UserCreate } from '../../interface/user/user-create';
import { RegisterComponent } from '../../components/register/register';
import { UpdateUserDialog } from '../gestionUtilisateur/update-user-dialog/update-user-dialog';
import { CreateUserDialog } from '../gestionUtilisateur/create-user-dialog/create-user-dialog';

@Component({
  selector: 'app-gestion-utilisateurs',
  templateUrl: './gestion-utilisateur.html',
  styleUrls: ['./gestion-utilisateur.css'],
  standalone: true,
  imports: [
    NgClass,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
  ]
})
export class GestionUtilisateursComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'nom', 'prenom', 'email', 'role', 'actions'
  ];
  dataSource!: MatTableDataSource<UserCreate>;

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.dataSource = new MatTableDataSource<UserCreate>(data);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filter: HTMLInputElement): void {
    this.dataSource.filter = filter.value.trim().toLowerCase();
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      ADMIN:    'badge-admin',
      COACH:    'badge-coach',
      JOUEUR:   'badge-joueur',
      ARBITRE:  'badge-arbitre',
    };
    return map[role] || '';
  }

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      ADMIN:   'Admin',
      COACH:   'Coach',
      JOUEUR:  'Joueur',
      ARBITRE: 'Arbitre',
    };
    return map[role] || role;
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(CreateUserDialog, {
      width: '520px',
      panelClass: 'modern-dialog',
      disableClose: false
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  openUpdateDialog(user: UserCreate): void {
    const ref = this.dialog.open(UpdateUserDialog, {
      width: '520px',
      panelClass: 'modern-dialog',
      disableClose: false,
      data: { ...user }
    });
    ref.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      if (result) this.userService.updateUser( result).subscribe(() => this.loadUsers());
    });
  }

  deleteUser(id: number): void {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}