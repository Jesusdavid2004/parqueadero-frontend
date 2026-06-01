import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
  private router = inject(Router);

  @Input({ required: true }) menu!: MenuItem;
  @Input() nivel = 0;

  expanded = false;

  get tieneHijos(): boolean {
    return (this.menu.hijos?.length ?? 0) > 0;
  }

  get esSeparador(): boolean {
    return !this.menu.ruta && this.tieneHijos;
  }

  toggle(): void {
    if (this.tieneHijos) {
      this.expanded = !this.expanded;
    } else if (this.menu.ruta && this.menu.activo) {
      this.router.navigateByUrl(this.menu.ruta);
    }
  }

  esRutaActiva(ruta: string | null | undefined): boolean {
    if (!ruta) return false;
    return this.router.url === ruta;
  }
}
