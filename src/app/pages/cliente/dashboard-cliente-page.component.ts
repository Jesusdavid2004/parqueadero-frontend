import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { ClienteZonaService } from '../../core/services/cliente-zona.service';
import { AuthService } from '../../core/services/auth.service';
import { Ticket } from '../../core/models/ticket.model';
import { Vehiculo } from '../../core/models/vehiculo.model';

@Component({
  selector: 'app-dashboard-cliente-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-cliente-page.component.html',
  styleUrl: './dashboard-cliente-page.component.scss'
})
export class DashboardClientePageComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private clienteZonaService = inject(ClienteZonaService);

  tickets: Ticket[] = [];
  vehiculos: Vehiculo[] = [];
  username = '';
  nombreCliente = '';
  totalVehiculos = 0;
  totalTickets = 0;
  error = '';

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.username = user?.username ?? '';

    this.cargarDashboard();
    this.cargarVehiculos();
    this.cargarTickets();
  }

  cargarDashboard(): void {
    this.clienteZonaService.dashboard().subscribe({
      next: (resp) => {
        this.nombreCliente = resp.nombreCliente;
        this.totalVehiculos = resp.totalVehiculos;
        this.totalTickets = resp.totalTickets;
      },
      error: (err) => {
        console.error('Error dashboard cliente:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'No se pudo cargar el dashboard del cliente';
      }
    });
  }

  cargarVehiculos(): void {
    this.clienteZonaService.misVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
      },
      error: (err) => {
        console.error('Error cargando vehículos del cliente:', err);
      }
    });
  }

  cargarTickets(): void {
    this.clienteZonaService.misTickets().subscribe({
      next: (data) => {
        this.tickets = data;
      },
      error: (err) => {
        console.error('Error cargando tickets del cliente:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}