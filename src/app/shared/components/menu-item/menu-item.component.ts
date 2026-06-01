import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {
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
    this.expanded = !this.expanded;
  }
}
