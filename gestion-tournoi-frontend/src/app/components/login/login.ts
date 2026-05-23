import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../models/role';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  loading = false;
  errorMsg = '';

  loginForm!: FormGroup; 

  constructor(private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
   
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.authService.login({email, password}).subscribe({
      next: (res: any) => {
        this.loading = false;

        this.authService.saveToken(res.token);
        this.authService.saveUser(res.user);
        alert(res.message || "Connexion réussie !"+res.user.role);
        if (res.user.role === Role.Responsable) {
          this.router.navigate(['/responsable']);
        } else if (res.user.role === Role.Admin) {
          this.router.navigate(['/admin']);
        }
      },
      error: (err) => {
        console.log("ERROR HERE", err);
        this.loading = false;
        this.errorMsg ="Email ou mot de passe incorrect";
        this.cdr.detectChanges();
      }
    });
  }
}