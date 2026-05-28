import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EspacioParqueoService } from '../../core/services/espacio-parqueo.service';
import { ZonaService } from '../../core/services/zona.service';
import { EspacioParqueo } from '../../core/models/espacio-parqueo.model';
import { Zona } from '../../core/models/zona.model';

@Component({
  selector: 'app-espacios-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './espacios-page.component.html',
  styleUrl: './espacios-page.component.scss'
})
export class EspaciosPageComponent implements OnInit {
  private espacioService = inject(EspacioParqueoService);
  private zonaService = inject(ZonaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  espacios: EspacioParqueo[] = [];
  zonas: Zona[] = [];

  loading = false;
  error = '';
  editando = false;
  espacioActualId: number | null = null;

  modelo = {
    codigo: '',
    ubicacion: '',
    estado: 'DISPONIBLE',
    tipoVehiculoPermitido: 'CARRO',
    zonaId: null as number | null
  };

  estadosEspacio = ['DISPONIBLE', 'OCUPADO', 'RESERVADO', 'INACTIVO'];
  tiposVehiculo = ['CARRO', 'MOTO', 'CAMION'];

  ngOnInit(): void {
    this.cargarZonas();
    this.cargarEspacios();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarZonas(): void {
    this.zonaService.listar().subscribe({
      next: (data) => {
        this.zonas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando zonas:', err)
    });
  }

  cargarEspacios(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.espacioService.listar().subscribe({
      next: (data) => {
        this.espacios = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar los espacios. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.espacioActualId = null;
    this.modelo = {
      codigo: '',
      ubicacion: '',
      estado: 'DISPONIBLE',
      tipoVehiculoPermitido: 'CARRO',
      zonaId: null
    };
    this.cdr.detectChanges();
  }

  editar(espacio: EspacioParqueo): void {
    this.editando = true;
    this.espacioActualId = espacio.id;
    this.modelo = {
      codigo: espacio.codigo,
      ubicacion: espacio.ubicacion,
      estado: espacio.estado,
      tipoVehiculoPermitido: espacio.tipoVehiculoPermitido,
      zonaId: espacio.zonaId
    };
    this.cdr.detectChanges();
  }

  guardar(): void {
    const payload = {
      codigo: this.modelo.codigo,
      ubicacion: this.modelo.ubicacion,
      estado: this.modelo.estado as EspacioParqueo['estado'],
      tipoVehiculoPermitido: this.modelo.tipoVehiculoPermitido as EspacioParqueo['tipoVehiculoPermitido'],
      zonaId: this.modelo.zonaId
    };

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const request = this.editando && this.espacioActualId !== null
      ? this.espacioService.actualizar(this.espacioActualId, payload)
      : this.espacioService.guardar(payload);

    request.subscribe({
      next: () => {
        this.nuevo();
        this.cargarEspacios();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar/actualizar el espacio. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(espacio: EspacioParqueo): void {
    if (!confirm(`¿Eliminar el espacio ${espacio.codigo}?`)) return;

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.espacioService.eliminar(espacio.id).subscribe({
      next: () => {
        this.cargarEspacios();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar el espacio. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
