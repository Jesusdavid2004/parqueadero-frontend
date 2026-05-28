import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SedeService } from '../../core/services/sede.service';
import { Sede } from '../../core/models/sede.model';

@Component({
  selector: 'app-sedes-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sedes-page.component.html',
  styleUrl: './sedes-page.component.scss'
})
export class SedesPageComponent implements OnInit {
  private sedeService = inject(SedeService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  sedes: Sede[] = [];
  loading = false;
  error = '';
  editando = false;
  sedeActualId: number | null = null;

  modelo = { nombre: '', direccion: '', ciudad: '' };

  ngOnInit(): void {
    this.cargarSedes();
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  cargarSedes(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.sedeService.listar().subscribe({
      next: (data) => {
        this.sedes = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error =
          err?.error?.mensaje || err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudieron cargar las sedes. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false;
    this.sedeActualId = null;
    this.modelo = { nombre: '', direccion: '', ciudad: '' };
    this.cdr.detectChanges();
  }

  editar(sede: Sede): void {
    this.editando = true;
    this.sedeActualId = sede.id;
    this.modelo = { nombre: sede.nombre, direccion: sede.direccion, ciudad: sede.ciudad };
    this.cdr.detectChanges();
  }

  guardar(): void {
    const payload = { ...this.modelo };
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const request = this.editando && this.sedeActualId !== null
      ? this.sedeService.actualizar(this.sedeActualId, payload)
      : this.sedeService.guardar(payload);

    request.subscribe({
      next: () => { this.nuevo(); this.cargarSedes(); },
      error: (err) => {
        this.error =
          err?.error?.mensaje || err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al guardar/actualizar la sede. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(sede: Sede): void {
    if (!confirm(`¿Eliminar la sede ${sede.nombre}?`)) return;
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.sedeService.eliminar(sede.id).subscribe({
      next: () => { this.cargarSedes(); },
      error: (err) => {
        this.error =
          err?.error?.mensaje || err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `Error al eliminar la sede. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
