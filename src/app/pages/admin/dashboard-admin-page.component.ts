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
import { EspacioParqueoService } from '../../core/services/espacio-parqueo.service';
import { SedeService } from '../../core/services/sede.service';
import { ZonaService } from '../../core/services/zona.service';
import { TarifaService } from '../../core/services/tarifa.service';
import { EmpleadoService } from '../../core/services/empleado.service';

import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Ticket } from '../../core/models/ticket.model';
import { Pago } from '../../core/models/pago.model';
import { Factura } from '../../core/models/factura.model';
import { Reserva } from '../../core/models/reserva.model';
import { MenuItem } from '../../core/models/menu.model';
import { EspacioParqueo } from '../../core/models/espacio-parqueo.model';
import { Sede } from '../../core/models/sede.model';
import { Zona } from '../../core/models/zona.model';
import { Tarifa } from '../../core/models/tarifa.model';
import { Empleado } from '../../core/models/empleado.model';

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
  private espacioService = inject(EspacioParqueoService);
  private sedeService = inject(SedeService);
  private zonaService = inject(ZonaService);
  private tarifaService = inject(TarifaService);
  private empleadoService = inject(EmpleadoService);

  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  tickets: Ticket[] = [];
  pagos: Pago[] = [];
  facturas: Factura[] = [];
  reservas: Reserva[] = [];
  menus: MenuItem[] = [];
  espacios: EspacioParqueo[] = [];
  sedes: Sede[] = [];
  zonas: Zona[] = [];
  tarifas: Tarifa[] = [];
  empleados: Empleado[] = [];

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
    if (!ruta || !item.activo) return;
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
      espacios: this.espacioService.listar().pipe(catchError(() => of([]))),
      sedes: this.sedeService.listar().pipe(catchError(() => of([]))),
      zonas: this.zonaService.listar().pipe(catchError(() => of([]))),
      tarifas: this.tarifaService.listar().pipe(catchError(() => of([]))),
      empleados: this.empleadoService.listar().pipe(catchError(() => of([]))),
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
        this.espacios = resp.espacios;
        this.sedes = resp.sedes;
        this.zonas = resp.zonas;
        this.tarifas = resp.tarifas;
        this.empleados = resp.empleados;
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
