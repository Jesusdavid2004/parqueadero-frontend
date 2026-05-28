import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TarifaService } from '../../core/services/tarifa.service';
import { Tarifa } from '../../core/models/tarifa.model';

@Component({
  selector: 'app-tarifas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tarifas-page.component.html',
  styleUrl: './tarifas-page.component.scss'
})
export class TarifasPageComponent implements OnInit {
  private tarifaService = inject(TarifaService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tarifas: Tarifa[] = [];
  loading = false;
  error = '';
  editando = false;
  tarifaActualId: number | null = null;

  modelo = { tipoVehiculo: 'CARRO', valorHora: 0, valorDia: 0, valorFraccion: 0 };
  tiposVehiculo = ['CARRO', 'MOTO', 'CAMION'];

  ngOnInit(): void { this.cargarTarifas(); }

  volverDashboard(): void { this.router.navigate(['/admin']); }

  cargarTarifas(): void {
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    this.tarifaService.listar().subscribe({
      next: (data) => { this.tarifas = data; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `No se pudieron cargar las tarifas. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false; this.tarifaActualId = null;
    this.modelo = { tipoVehiculo: 'CARRO', valorHora: 0, valorDia: 0, valorFraccion: 0 };
    this.cdr.detectChanges();
  }

  editar(tarifa: Tarifa): void {
    this.editando = true; this.tarifaActualId = tarifa.id;
    this.modelo = { tipoVehiculo: tarifa.tipoVehiculo, valorHora: tarifa.valorHora, valorDia: tarifa.valorDia, valorFraccion: tarifa.valorFraccion };
    this.cdr.detectChanges();
  }

  guardar(): void {
    const payload = { ...this.modelo, tipoVehiculo: this.modelo.tipoVehiculo as Tarifa['tipoVehiculo'] };
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    const request = this.editando && this.tarifaActualId !== null
      ? this.tarifaService.actualizar(this.tarifaActualId, payload)
      : this.tarifaService.guardar(payload);
    request.subscribe({
      next: () => { this.nuevo(); this.cargarTarifas(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al guardar/actualizar la tarifa. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  eliminar(tarifa: Tarifa): void {
    if (!confirm(`¿Eliminar la tarifa de ${tarifa.tipoVehiculo}?`)) return;
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    this.tarifaService.eliminar(tarifa.id).subscribe({
      next: () => { this.cargarTarifas(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al eliminar la tarifa. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }
}
