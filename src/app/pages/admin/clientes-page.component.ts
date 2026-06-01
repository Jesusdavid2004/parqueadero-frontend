import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ClienteService } from '../../core/services/cliente.service';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './clientes-page.component.html',
  styleUrl: './clientes-page.component.scss'
})
export class ClientesPageComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  clientes: Cliente[] = [];
  loading = false;
  error = '';

  editando = false;
  clienteActualId: number | null = null;

  modelo = {
    identificacion: '',
    nombre: '',
    telefono: '',
    correo: '',
    direccion: ''
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cargarClientes();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando clientes:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar los clientes. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.clienteActualId = null;
    this.modelo = {
      identificacion: '',
      nombre: '',
      telefono: '',
      correo: '',
      direccion: ''
    };
    this.cdr.detectChanges();
  }

  editar(cliente: Cliente): void {
    this.editando = true;
    this.clienteActualId = cliente.id;

    this.modelo = {
      identificacion: cliente.identificacion,
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      correo: cliente.correo,
      direccion: cliente.direccion
    };
    this.cdr.detectChanges();
  }

  guardar(): void {
    const payload = { ...this.modelo };

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    if (this.editando && this.clienteActualId !== null) {
      this.clienteService.actualizar(this.clienteActualId, payload).subscribe({
        next: () => {
          this.nuevo();
          this.cargarClientes();
        },
        error: (err) => {
          console.error('Error al actualizar cliente:', err);
          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            `Error al actualizar el cliente. Código: ${err?.status ?? 'desconocido'}`;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.clienteService.guardar(payload).subscribe({
        next: () => {
          this.nuevo();
          this.cargarClientes();
        },
        error: (err) => {
          console.error('Error al guardar cliente:', err);
          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            `Error al guardar el cliente. Código: ${err?.status ?? 'desconocido'}`;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(cliente: Cliente): void {
    const confirmado = confirm(`¿Eliminar al cliente ${cliente.nombre}?`);
    if (!confirmado) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.clienteService.eliminar(cliente.id).subscribe({
      next: () => {
        this.cargarClientes();
      },
      error: (err) => {
        console.error('Error al eliminar cliente:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar el cliente. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  crearAcceso(cliente: Cliente): void {
    this.router.navigate(['/register'], {
      queryParams: {
        rol: 'CLIENTE',
        clienteId: cliente.id
      }
    });
  }
}