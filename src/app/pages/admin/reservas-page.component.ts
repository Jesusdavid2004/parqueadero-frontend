import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReservaService } from '../../core/services/reserva.service';
import { ClienteService } from '../../core/services/cliente.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { EspacioParqueoService } from '../../core/services/espacio-parqueo.service';
import { Reserva } from '../../core/models/reserva.model';
import { Cliente } from '../../core/models/cliente.model';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { EspacioParqueo } from '../../core/models/espacio-parqueo.model';

@Component({
  selector: 'app-reservas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reservas-page.component.html',
  styleUrl: './reservas-page.component.scss'
})
export class ReservasPageComponent implements OnInit {
  private reservaService = inject(ReservaService);
  private clienteService = inject(ClienteService);
  private vehiculoService = inject(VehiculoService);
  private espacioService = inject(EspacioParqueoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  reservas: Reserva[] = [];
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  espacios: EspacioParqueo[] = [];

  loading = false;
  error = '';
  editando = false;
  reservaActualId: number | null = null;

  modelo = {
    codigoReserva: '',
    fechaReserva: '',
    horaInicio: '',
    horaFin: '',
    estado: 'PENDIENTE',
    clienteId: null as number | null,
    vehiculoId: null as number | null,
    espacioId: null as number | null
  };

  estadosReserva = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'VENCIDA'];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cargarClientes();
    this.cargarVehiculos();
    this.cargarEspacios();
    this.cargarReservas();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });
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

  cargarEspacios(): void {
    this.espacioService.listar().subscribe({
      next: (data) => {
        this.espacios = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando espacios:', err)
    });
  }

  cargarReservas(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.reservaService.listar().subscribe({
      next: (data) => {
        this.reservas = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar las reservas. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.reservaActualId = null;
    this.modelo = {
      codigoReserva: '',
      fechaReserva: '',
      horaInicio: '',
      horaFin: '',
      estado: 'PENDIENTE',
      clienteId: null,
      vehiculoId: null,
      espacioId: null
    };
    this.cdr.detectChanges();
  }

  editar(reserva: Reserva): void {
    this.editando = true;
    this.reservaActualId = reserva.id;
    this.modelo = {
      codigoReserva: reserva.codigoReserva,
      fechaReserva: this.formatearFechaInput(reserva.fechaReserva),
      horaInicio: this.formatearFechaInput(reserva.horaInicio),
      horaFin: this.formatearFechaInput(reserva.horaFin),
      estado: reserva.estado,
      clienteId: reserva.clienteId,
      vehiculoId: reserva.vehiculoId,
      espacioId: reserva.espacioId
    };
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (this.modelo.clienteId === null || this.modelo.vehiculoId === null || this.modelo.espacioId === null) {
      this.error = 'Debes seleccionar cliente, vehículo y espacio.';
      this.cdr.detectChanges();
      return;
    }

    const payload = {
      codigoReserva: this.modelo.codigoReserva,
      fechaReserva: this.modelo.fechaReserva ? `${this.modelo.fechaReserva}:00` : '',
      horaInicio: this.modelo.horaInicio ? `${this.modelo.horaInicio}:00` : '',
      horaFin: this.modelo.horaFin ? `${this.modelo.horaFin}:00` : '',
      estado: this.modelo.estado as Reserva['estado'],
      clienteId: Number(this.modelo.clienteId),
      vehiculoId: Number(this.modelo.vehiculoId),
      espacioId: Number(this.modelo.espacioId)
    };

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const request = this.editando && this.reservaActualId !== null
      ? this.reservaService.actualizar(this.reservaActualId, payload)
      : this.reservaService.guardar(payload);

    request.subscribe({
      next: () => {
        this.nuevo();
        this.cargarReservas();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar/actualizar la reserva. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(reserva: Reserva): void {
    if (!confirm(`¿Eliminar la reserva ${reserva.codigoReserva}?`)) return;

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.reservaService.eliminar(reserva.id).subscribe({
      next: () => {
        this.cargarReservas();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar la reserva. Código: ${err?.status ?? 'desconocido'}`;
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
