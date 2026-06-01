import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmpleadoService } from '../../core/services/empleado.service';
import { Empleado } from '../../core/models/empleado.model';

@Component({
  selector: 'app-empleados-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './empleados-page.component.html',
  styleUrl: './empleados-page.component.scss'
})
export class EmpleadosPageComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  empleados: Empleado[] = [];
  loading = false;
  error = '';
  editando = false;
  empleadoActualId: number | null = null;

  modelo = { identificacion: '', nombre: '', telefono: '', correo: '', codigoEmpleado: '', cargo: '' };

  ngOnInit(): void { if (!isPlatformBrowser(this.platformId)) return; this.cargarEmpleados(); }

  volverDashboard(): void { this.router.navigate(['/admin']); }

  cargarEmpleados(): void {
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    this.empleadoService.listar().subscribe({
      next: (data) => { this.empleados = data; this.loading = false; this.cdr.detectChanges(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `No se pudieron cargar los empleados. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  nuevo(): void {
    this.editando = false; this.empleadoActualId = null;
    this.modelo = { identificacion: '', nombre: '', telefono: '', correo: '', codigoEmpleado: '', cargo: '' };
    this.cdr.detectChanges();
  }

  editar(empleado: Empleado): void {
    this.editando = true; this.empleadoActualId = empleado.id;
    this.modelo = { identificacion: empleado.identificacion, nombre: empleado.nombre, telefono: empleado.telefono, correo: empleado.correo, codigoEmpleado: empleado.codigoEmpleado, cargo: empleado.cargo };
    this.cdr.detectChanges();
  }

  guardar(): void {
    const payload = { ...this.modelo };
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    const request = this.editando && this.empleadoActualId !== null
      ? this.empleadoService.actualizar(this.empleadoActualId, payload)
      : this.empleadoService.guardar(payload);
    request.subscribe({
      next: () => { this.nuevo(); this.cargarEmpleados(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al guardar/actualizar el empleado. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }

  eliminar(empleado: Empleado): void {
    if (!confirm(`¿Eliminar al empleado ${empleado.nombre}?`)) return;
    this.loading = true; this.error = ''; this.cdr.detectChanges();
    this.empleadoService.eliminar(empleado.id).subscribe({
      next: () => { this.cargarEmpleados(); },
      error: (err) => {
        this.error = err?.error?.mensaje || err?.error?.message || (typeof err?.error === 'string' ? err.error : null) || `Error al eliminar el empleado. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false; this.cdr.detectChanges();
      }
    });
  }
}
