import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ZonaService } from '../../core/services/zona.service';
import { SedeService } from '../../core/services/sede.service';
import { Zona } from '../../core/models/zona.model';
import { Sede } from '../../core/models/sede.model';

@Component({
  selector: 'app-zonas-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './zonas-page.component.html',
  styleUrl: './zonas-page.component.scss'
})
export class ZonasPageComponent implements OnInit {
  private zonaService = inject(ZonaService);
  private sedeService = inject(SedeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  zonas: Zona[] = [];
  sedes: Sede[] = [];
  loading = false;
  error = '';
  editando = false;
  zonaActualId: number | null = null;

  modelo = { nombre: '', descripcion: '', tipoZona: 'MIXTA', sedeId: null as number | null };
  tiposZona = ['CARROS', 'MOTOS', 'CAMIONES', 'MIXTA'];

  ngOnInit(): void {
    this.cargarSedes();
    this.cargarZonas();
  }

  volverDashboard(): void { this.router.navigate(['/admin']); }

  cargarSedes(): void {
    this.sedeService.listar().subscribe({
      next: (data) => { this.sedes = data; this.cdr.detectChanges(); },
      error: (err) => console.error('Error cargando sedes:', err)
    });
  }

  cargarZonas(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();
    this.zonaService.listar().subscribe({
      next: (data) => { this.zonas = data; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `No se pudieron cargar las zonas. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.zonaActualId = null;
    this.modelo = { nombre: '', descripcion: '', tipoZona: 'MIXTA', sedeId: null };
    this.cdr.detectChanges();
  }

  editar(zona: Zona): void {
    this.editando = true;
    this.zonaActualId = zona.id;
    this.modelo = { nombre: zona.nombre, descripcion: zona.descripcion, tipoZona: zona.tipoZona, sedeId: zona.sedeId };
    this.cdr.detectChanges();
  }

  guardar(): void {
    if (this.modelo.sedeId === null) { this.error = 'Debes seleccionar una sede.'; this.cdr.detectChanges(); return; }
    const payload = { nombre: this.modelo.nombre, descripcion: this.modelo.descripcion, tipoZona: this.modelo.tipoZona as Zona['tipoZona'], sedeId: Number(this.modelo.sedeId) };
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    const request = this.editando && this.zonaActualId !== null
      ? this.zonaService.actualizar(this.zonaActualId, payload)
      : this.zonaService.guardar(payload);
    request.subscribe({
      next: () => { this.nuevo(); this.cargarZonas(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al guardar/actualizar la zona. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  eliminar(zona: Zona): void {
    if (!confirm(`¿Eliminar la zona ${zona.nombre}?`)) return;
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    this.zonaService.eliminar(zona.id).subscribe({
      next: () => { this.cargarZonas(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al eliminar la zona. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }
}
