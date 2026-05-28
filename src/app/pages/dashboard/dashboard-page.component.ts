import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { TicketService } from '../../core/services/ticket.service';
import { PagoService } from '../../core/services/pago.service';
import { FacturaService } from '../../core/services/factura.service';
import { ReservaService } from '../../core/services/reserva.service';
import { MenuService } from '../../core/services/menu.service';
import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Ticket } from '../../core/models/ticket.model';
import { Pago } from '../../core/models/pago.model';
import { Factura } from '../../core/models/factura.model';
import { Reserva } from '../../core/models/reserva.model';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent implements OnInit {
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

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading = true;

    this.clienteService.listar().subscribe({
      next: data => (this.clientes = data),
      error: err => console.error('Error clientes', err)
    });

    this.vehiculoService.listar().subscribe({
      next: data => (this.vehiculos = data),
      error: err => console.error('Error vehiculos', err)
    });

    this.ticketService.listar().subscribe({
      next: data => (this.tickets = data),
      error: err => console.error('Error tickets', err)
    });

    this.pagoService.listar().subscribe({
      next: data => (this.pagos = data),
      error: err => console.error('Error pagos', err)
    });

    this.facturaService.listar().subscribe({
      next: data => (this.facturas = data),
      error: err => console.error('Error facturas', err)
    });

    this.reservaService.listar().subscribe({
      next: data => (this.reservas = data),
      error: err => console.error('Error reservas', err)
    });

    this.menuService.listarArbol().subscribe({
      next: data => {
        this.menus = data;
        this.loading = false;
      },
      error: err => {
        console.error('Error menus', err);
        this.loading = false;
      }
    });
  }

  contarMenus(items: MenuItem[]): number {
    let total = 0;
    for (const item of items) {
      total += 1;
      if (item.hijos && item.hijos.length > 0) {
        total += this.contarMenus(item.hijos);
      }
    }
    return total;
  }
}