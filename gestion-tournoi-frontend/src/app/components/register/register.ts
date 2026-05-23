import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {

  nom = '';
  prenom = '';
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      password: this.password
    }).subscribe(() => this.router.navigate(['/login']));
  }
}
