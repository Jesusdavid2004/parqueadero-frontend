import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  modelo = { username: '', password: '' };
  loading = false;
  error = '';

  login(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.modelo).subscribe({
      next: user => {
        this.loading = false;
        if (user.rol === 'ADMIN') {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['cliente']);
        }
      },
      error: err => {
        this.loading = false;
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          'No se pudo iniciar sesión';
      }
    });
  }

  irRegistro(): void {
    this.router.navigate(['register']);
  }
}