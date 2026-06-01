import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../../core/services/ticket.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { EspacioParqueoService } from '../../core/services/espacio-parqueo.service';
import { Ticket } from '../../core/models/ticket.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { EspacioParqueo } from '../../core/models/espacio-parqueo.model';

@Component({
  selector: 'app-tickets-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tickets-page.component.html',
  styleUrl: './tickets-page.component.scss'
})
export class TicketsPageComponent implements OnInit {
  private ticketService = inject(TicketService);
  private vehiculoService = inject(VehiculoService);
  private espacioService = inject(EspacioParqueoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  tickets: Ticket[] = [];
  vehiculos: Vehiculo[] = [];
  espaciosDisponibles: EspacioParqueo[] = [];

  loading = false;
  error = '';
  editando = false;
  ticketActualId: number | null = null;

  modelo = {
    codigoTicket: '',
    horaEntrada: '',
    horaSalida: '',
    estado: 'ABIERTO',
    vehiculoId: null as number | null,
    espacioId: null as number | null
  };

  estadosTicket = ['ABIERTO', 'CERRADO', 'FACTURADO'];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cargarVehiculos();
    this.cargarEspaciosDisponibles();
    this.cargarTickets();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarVehiculos(): void {
    this.vehiculoService.listar().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando vehículos:', err)
    });
  }

  cargarEspaciosDisponibles(): void {
    this.espacioService.listarDisponibles().subscribe({
      next: (data) => {
        this.espaciosDisponibles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando espacios disponibles:', err)
    });
  }

  cargarTickets(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.ticketService.listar().subscribe({
      next: (data) => {
        this.tickets = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar los tickets. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.ticketActualId = null;
    this.modelo = {
      codigoTicket: '',
      horaEntrada: '',
      horaSalida: '',
      estado: 'ABIERTO',
      vehiculoId: null,
      espacioId: null
    };
    this.cdr.detectChanges();
  }

  editar(ticket: Ticket): void {
    this.editando = true;
    this.ticketActualId = ticket.id;
    this.modelo = {
      codigoTicket: ticket.codigoTicket,
      horaEntrada: this.formatearFechaInput(ticket.horaEntrada),
      horaSalida: ticket.horaSalida ? this.formatearFechaInput(ticket.horaSalida) : '',
      estado: ticket.estado,
      vehiculoId: ticket.vehiculoId,
      espacioId: ticket.espacioId
    };
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (this.modelo.vehiculoId === null || this.modelo.espacioId === null) {
      this.error = 'Debes seleccionar vehículo y espacio.';
      this.cdr.detectChanges();
      return;
    }

    const payload: Omit<Ticket, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'> = {
      codigoTicket: this.modelo.codigoTicket,
      horaEntrada: this.modelo.horaEntrada ? `${this.modelo.horaEntrada}:00` : '',
      horaSalida: this.modelo.horaSalida ? `${this.modelo.horaSalida}:00` : null,
      estado: this.modelo.estado as Ticket['estado'],
      total: 0,
      vehiculoId: Number(this.modelo.vehiculoId),
      espacioId: Number(this.modelo.espacioId)
    };

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const request = this.editando && this.ticketActualId !== null
      ? this.ticketService.actualizar(this.ticketActualId, payload)
      : this.ticketService.guardar(payload);

    request.subscribe({
      next: () => {
        this.nuevo();
        this.cargarTickets();
        this.cargarEspaciosDisponibles();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar/actualizar el ticket. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(ticket: Ticket): void {
    if (!confirm(`¿Eliminar el ticket ${ticket.codigoTicket}?`)) return;

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.ticketService.eliminar(ticket.id).subscribe({
      next: () => {
        this.cargarTickets();
        this.cargarEspaciosDisponibles();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar el ticket. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private formatearFechaInput(valor: string): string {
    if (!valor) return '';
    return valor.length >= 16 ? valor.substring(0, 16) : valor;
  }
}