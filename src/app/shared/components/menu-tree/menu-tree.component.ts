import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuItem } from '../../../core/models/menu.model';

@Component({
  selector: 'app-menu-tree',
  standalone: true,
  imports: [CommonModule, MenuTreeComponent],
  template: `
    <div class="menu-list">
      <div class="tree-item" *ngFor="let item of items">
        <strong>{{ item.nombre }}</strong>
        <small>{{ item.ruta || 'Sin ruta' }}</small>

        <div class="children" *ngIf="item.hijos.length">
          <app-menu-tree [items]="item.hijos"></app-menu-tree>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tree-item {
      background: #f5f6f8;
      border-radius: 16px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tree-item strong {
      font-size: 14px;
      color: #0f172a;
    }

    .tree-item small {
      color: #6b7280;
      font-size: 13px;
    }

    .children {
      margin-left: 18px;
      margin-top: 8px;
      padding-left: 12px;
      border-left: 2px dashed #d1d5db;
    }
  `]
})
export class MenuTreeComponent {
  @Input() items: MenuItem[] = [];
}