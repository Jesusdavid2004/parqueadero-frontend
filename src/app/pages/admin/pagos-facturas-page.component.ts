import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PagoService } from '../../core/services/pago.service';
import { FacturaService } from '../../core/services/factura.service';
import { TicketService } from '../../core/services/ticket.service';

import { Pago } from '../../core/models/pago.model';
import { Factura } from '../../core/models/factura.model';
import { Ticket } from '../../core/models/ticket.model';

@Component({
  selector: 'app-pagos-facturas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pagos-facturas-page.component.html',
  styleUrls: ['./pagos-facturas-page.component.scss']
})
export class PagosFacturasPageComponent implements OnInit {
  private pagoService = inject(PagoService);
  private facturaService = inject(FacturaService);
  private ticketService = inject(TicketService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  pagos: Pago[] = [];
  facturas: Factura[] = [];
  tickets: Ticket[] = [];

  loadingPagos = false;
  loadingFacturas = false;
  errorPagos = '';
  errorFacturas = '';

  metodosPago = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'QR'];
  estadosPago = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO'];

  modeloPago = {
    metodoPago: 'EFECTIVO',
    estado: 'PENDIENTE',
    referencia: '',
    fecha: '',
    ticketId: null as number | null
  };

  modeloFactura = {
    pagoId: null as number | null
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cargarTickets();
    this.cargarPagos();
    this.cargarFacturas();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarTickets(): void {
    this.ticketService.listar().subscribe({
      next: (data) => {
        this.tickets = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando tickets:', err);
      }
    });
  }

  cargarPagos(): void {
    this.loadingPagos = true;
    this.errorPagos = '';
    this.cdr.detectChanges();

    this.pagoService.listar().subscribe({
      next: (data) => {
        this.pagos = data;
        this.loadingPagos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando pagos:', err);
        this.errorPagos =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar los pagos. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingPagos = false;
        this.cdr.detectChanges();
      }
    });
  }

  cargarFacturas(): void {
    this.loadingFacturas = true;
    this.errorFacturas = '';
    this.cdr.detectChanges();

    this.facturaService.listar().subscribe({
      next: (data) => {
        this.facturas = data;
        this.loadingFacturas = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando facturas:', err);
        this.errorFacturas =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar las facturas. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingFacturas = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevoPago(): void {
    this.modeloPago = {
      metodoPago: 'EFECTIVO',
      estado: 'PENDIENTE',
      referencia: '',
      fecha: '',
      ticketId: null
    };
    this.cdr.detectChanges();
  }

  nuevaFactura(): void {
    this.modeloFactura = {
      pagoId: null
    };
    this.cdr.detectChanges();
  }

  guardarPago(): void {
    if (this.modeloPago.ticketId === null) {
      this.errorPagos = 'Debes seleccionar un ticket.';
      this.cdr.detectChanges();
      return;
    }

    const payload: Omit<Pago, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'> = {
      monto: 0,
      metodoPago: this.modeloPago.metodoPago as Pago['metodoPago'],
      estado: this.modeloPago.estado as Pago['estado'],
      referencia: this.modeloPago.referencia,
      fecha: this.modeloPago.fecha,
      ticketId: Number(this.modeloPago.ticketId)
    };

    this.loadingPagos = true;
    this.errorPagos = '';
    this.cdr.detectChanges();

    this.pagoService.guardar(payload).subscribe({
      next: () => {
        this.nuevoPago();
        this.cargarPagos();
      },
      error: (err) => {
        console.error('Error guardando pago:', err);
        this.errorPagos =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar el pago. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingPagos = false;
        this.cdr.detectChanges();
      }
    });
  }

  guardarFactura(): void {
    if (this.modeloFactura.pagoId === null) {
      this.errorFacturas = 'Debes seleccionar un pago.';
      this.cdr.detectChanges();
      return;
    }

    const payload: Omit<Factura, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'> = {
      numeroFactura: '',
      subtotal: 0,
      impuesto: 0,
      total: 0,
      pagoId: Number(this.modeloFactura.pagoId)
    };

    this.loadingFacturas = true;
    this.errorFacturas = '';
    this.cdr.detectChanges();

    this.facturaService.guardar(payload).subscribe({
      next: () => {
        this.nuevaFactura();
        this.cargarFacturas();
      },
      error: (err) => {
        console.error('Error guardando factura:', err);
        this.errorFacturas =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar la factura. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingFacturas = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPago(pago: Pago): void {
    if (!confirm(`¿Eliminar el pago con referencia ${pago.referencia}?`)) {
      return;
    }

    this.loadingPagos = true;
    this.errorPagos = '';
    this.cdr.detectChanges();

    this.pagoService.eliminar(pago.id).subscribe({
      next: () => {
        this.cargarPagos();
      },
      error: (err) => {
        console.error('Error eliminando pago:', err);
        this.errorPagos =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar el pago. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingPagos = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarFactura(factura: Factura): void {
    if (!confirm(`¿Eliminar la factura ${factura.numeroFactura}?`)) {
      return;
    }

    this.loadingFacturas = true;
    this.errorFacturas = '';
    this.cdr.detectChanges();

    this.facturaService.eliminar(factura.id).subscribe({
      next: () => {
        this.cargarFacturas();
      },
      error: (err) => {
        console.error('Error eliminando factura:', err);
        this.errorFacturas =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar la factura. Código: ${err?.status ?? 'desconocido'}`;
        this.loadingFacturas = false;
        this.cdr.detectChanges();
      }
    });
  }
}