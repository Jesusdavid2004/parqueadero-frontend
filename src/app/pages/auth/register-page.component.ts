import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AuthService, RegisterRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  success = '';

  form: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    rol: 'CLIENTE',
    clienteId: null
  };

  constructor() {
    this.route.queryParams.subscribe((params) => {
      const rol = params['rol'] as 'ADMIN' | 'CLIENTE' | undefined;
      const clienteId = params['clienteId'];

      if (rol) {
        this.form.rol = rol;
      }

      if (clienteId) {
        this.form.clienteId = Number(clienteId);
      }
    });
  }

  register(): void {
    this.error = '';
    this.success = '';

    if (!this.form.username.trim()) {
      this.error = 'El username es obligatorio';
      return;
    }

    if (!this.form.email.trim()) {
      this.error = 'El email es obligatorio';
      return;
    }

    if (!this.form.password || this.form.password.length < 4) {
      this.error = 'La contraseña debe tener al menos 4 caracteres';
      return;
    }

    if (this.form.rol === 'CLIENTE' && !this.form.clienteId) {
      this.error = 'Para rol CLIENTE debes ingresar clienteId';
      return;
    }

    const payload: RegisterRequest = {
      username: this.form.username.trim(),
      email: this.form.email.trim(),
      password: this.form.password,
      rol: this.form.rol,
      clienteId: this.form.rol === 'CLIENTE' ? this.form.clienteId : null
    };

    this.loading = true;

    this.authService.register(payload).subscribe({
      next: (resp) => {
        this.success = resp.mensaje ?? 'Usuario registrado correctamente';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.error =
          err?.error?.message ||
          err?.error?.mensaje ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'No se pudo registrar el usuario';
        this.loading = false;
      }
    });
  }

  irLogin(): void {
    this.router.navigate(['/login']);
  }
}