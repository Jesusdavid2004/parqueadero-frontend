import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
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
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  vehiculos: Vehiculo[] = [];
  username = '';
  nombreCliente = '';
  totalVehiculos = 0;
  totalTickets = 0;
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = this.authService.getCurrentUser();
    this.username = user?.username ?? '';

    this.cargarDashboard();
    this.cargarVehiculos();
    this.cargarTickets();
  }

  cargarDashboard(): void {
    console.log('Cargando dashboard cliente...');
    this.clienteZonaService.dashboard().subscribe({
      next: (resp) => {
        console.log('Dashboard recibido:', resp);
        this.nombreCliente = resp.nombreCliente;
        this.totalVehiculos = resp.totalVehiculos;
        this.totalTickets = resp.totalTickets;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error dashboard cliente:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error ${err?.status}: No se pudo cargar el dashboard del cliente`;
        this.cdr.detectChanges();
      }
    });
  }

  cargarVehiculos(): void {
    console.log('Cargando vehículos del cliente...');
    this.clienteZonaService.misVehiculos().subscribe({
      next: (data) => {
        console.log('Vehículos recibidos:', data);
        this.vehiculos = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando vehículos del cliente:', err);
        this.error += `\nVehículos: ${err?.error?.mensaje || (typeof err?.error === 'string' ? err.error : `Error ${err?.status}`)}`;
        this.cdr.detectChanges();
      }
    });
  }

  cargarTickets(): void {
    console.log('Cargando tickets del cliente...');
    this.clienteZonaService.misTickets().subscribe({
      next: (data) => {
        console.log('Tickets recibidos:', data);
        this.tickets = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando tickets del cliente:', err);
        this.error += `\nTickets: ${err?.error?.mensaje || (typeof err?.error === 'string' ? err.error : `Error ${err?.status}`)}`;
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}