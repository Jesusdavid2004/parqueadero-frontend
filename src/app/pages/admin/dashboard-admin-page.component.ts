import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { TicketService } from '../../core/services/ticket.service';
import { PagoService } from '../../core/services/pago.service';
import { FacturaService } from '../../core/services/factura.service';
import { ReservaService } from '../../core/services/reserva.service';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/services/auth.service';

import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Ticket } from '../../core/models/ticket.model';
import { Pago } from '../../core/models/pago.model';
import { Factura } from '../../core/models/factura.model';
import { Reserva } from '../../core/models/reserva.model';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-dashboard-admin-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-admin-page.component.html',
  styleUrls: ['./dashboard-admin-page.component.scss']
})
export class DashboardAdminPageComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private vehiculoService = inject(VehiculoService);
  private ticketService = inject(TicketService);
  private pagoService = inject(PagoService);
  private facturaService = inject(FacturaService);
  private reservaService = inject(ReservaService);
  private menuService = inject(MenuService);

  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  tickets: Ticket[] = [];
  pagos: Pago[] = [];
  facturas: Factura[] = [];
  reservas: Reserva[] = [];
  menus: MenuItem[] = [];

  loading = true;
  error = '';

  ngOnInit(): void {
    this.cargarDatos();
  }

  navegarDashboard(): void {
    this.router.navigate(['/admin']);
  }

  navegarCliente(): void {
    this.router.navigate(['/cliente']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irRutaMenu(item: MenuItem): void {
    const ruta = item.ruta?.trim();

    if (!ruta || !item.activo) {
      return;
    }

    this.router.navigateByUrl(ruta);
  }

  esRutaActiva(ruta: string | null | undefined): boolean {
    if (!ruta) return false;
    return this.router.url === ruta;
  }

  get menuSidebar(): MenuItem[] {
    const raizInicio = this.menus.find(item => item.ruta === '/admin');
    return raizInicio?.hijos ?? [];
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      clientes: this.clienteService.listar().pipe(catchError(() => of([]))),
      vehiculos: this.vehiculoService.listar().pipe(catchError(() => of([]))),
      tickets: this.ticketService.listar().pipe(catchError(() => of([]))),
      pagos: this.pagoService.listar().pipe(catchError(() => of([]))),
      facturas: this.facturaService.listar().pipe(catchError(() => of([]))),
      reservas: this.reservaService.listar().pipe(catchError(() => of([]))),
      menus: this.menuService.listarArbol().pipe(
        catchError((err) => {
          console.error('Error real cargando menú', err);
          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            `Falló la carga del menú. Código: ${err?.status ?? 'desconocido'}`;
          return of([]);
        })
      )
    }).subscribe({
      next: (resp) => {
        this.clientes = resp.clientes;
        this.vehiculos = resp.vehiculos;
        this.tickets = resp.tickets;
        this.pagos = resp.pagos;
        this.facturas = resp.facturas;
        this.reservas = resp.reservas;
        this.menus = resp.menus;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los datos del dashboard.';
        this.loading = false;
      }
    });
  }

  contarMenus(items: MenuItem[]): number {
    let total = 0;

    for (const item of items) {
      total += 1;
      if (item.hijos?.length) {
        total += this.contarMenus(item.hijos);
      }
    }

    return total;
  }
}