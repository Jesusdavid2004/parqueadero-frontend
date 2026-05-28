import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { VehiculoService } from '../../core/services/vehiculo.service';
import { ClienteService } from '../../core/services/cliente.service';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Cliente } from '../../core/models/cliente.model';

@Component({
  selector: 'app-vehiculos-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vehiculos-page.component.html',
  styleUrls: ['./vehiculos-page.component.scss']
})
export class VehiculosPageComponent implements OnInit {
  private vehiculoService = inject(VehiculoService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  vehiculos: Vehiculo[] = [];
  clientes: Cliente[] = [];
  loading = false;
  error = '';

  editando = false;
  vehiculoActualId: number | null = null;

  modelo = {
    placa: '',
    marca: '',
    modelo: '',
    color: '',
    tipoVehiculo: 'CARRO',
    clienteId: null as number | null
  };

  tiposVehiculo = ['CARRO', 'MOTO', 'CAMION'];

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarVehiculos();
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
      error: (err) => {
        console.error('Error cargando clientes:', err);
      }
    });
  }

  cargarVehiculos(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.vehiculoService.listar().subscribe({
      next: (data) => {
        this.vehiculos = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando vehículos:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar los vehículos. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.vehiculoActualId = null;
    this.modelo = {
      placa: '',
      marca: '',
      modelo: '',
      color: '',
      tipoVehiculo: 'CARRO',
      clienteId: null
    };
    this.cdr.detectChanges();
  }

  editar(vehiculo: Vehiculo): void {
    this.editando = true;
    this.vehiculoActualId = vehiculo.id;
    this.modelo = {
      placa: vehiculo.placa,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      color: vehiculo.color,
      tipoVehiculo: vehiculo.tipoVehiculo,
      clienteId: vehiculo.clienteId
    };
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (this.modelo.clienteId === null) {
      this.error = 'Debes seleccionar un cliente.';
      this.cdr.detectChanges();
      return;
    }

    const payload: Omit<Vehiculo, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'activo'> = {
      placa: this.modelo.placa,
      marca: this.modelo.marca,
      modelo: this.modelo.modelo,
      color: this.modelo.color,
      tipoVehiculo: this.modelo.tipoVehiculo as Vehiculo['tipoVehiculo'],
      clienteId: Number(this.modelo.clienteId)
    };

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    if (this.editando && this.vehiculoActualId !== null) {
      this.vehiculoService.actualizar(this.vehiculoActualId, payload).subscribe({
        next: () => {
          this.nuevo();
          this.cargarVehiculos();
        },
        error: (err) => {
          console.error('Error actualizando vehículo:', err);
          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            `Error al actualizar el vehículo. Código: ${err?.status ?? 'desconocido'}`;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.vehiculoService.guardar(payload).subscribe({
        next: () => {
          this.nuevo();
          this.cargarVehiculos();
        },
        error: (err) => {
          console.error('Error guardando vehículo:', err);
          this.error =
            err?.error?.mensaje ||
            err?.error?.message ||
            (typeof err?.error === 'string' ? err.error : null) ||
            `Error al guardar el vehículo. Código: ${err?.status ?? 'desconocido'}`;
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  eliminar(vehiculo: Vehiculo): void {
    const confirmado = confirm(`¿Eliminar el vehículo ${vehiculo.placa}?`);
    if (!confirmado) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.vehiculoService.eliminar(vehiculo.id).subscribe({
      next: () => {
        this.cargarVehiculos();
      },
      error: (err) => {
        console.error('Error eliminando vehículo:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar el vehículo. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}