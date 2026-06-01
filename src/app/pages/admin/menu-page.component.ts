import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { MenuService } from '../../core/services/menu.service';
import { MenuItem } from '../../core/models/menu.model';

@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent implements OnInit {
  private menuService = inject(MenuService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  menus: MenuItem[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cargarMenus();
  }

  cargarMenus(): void {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.menuService.listarArbol().subscribe({
      next: (data) => {
        this.menus = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando menú:', err);
        this.error =
          err?.error?.mensaje ||
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          `No se pudo cargar el menú. Código: ${err?.status ?? 'desconocido'}`;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  volverDashboard(): void {
    this.router.navigate(['/admin']);
  }

  contarNodos(items: MenuItem[]): number {
    let total = 0;

    for (const item of items) {
      total += 1;

      if (item.hijos?.length) {
        total += this.contarNodos(item.hijos);
      }
    }

    return total;
  }
}