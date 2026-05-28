import { Routes } from '@angular/router';

import { DashboardAdminPageComponent } from './pages/admin/dashboard-admin-page.component';
import { DashboardClientePageComponent } from './pages/cliente/dashboard-cliente-page.component';
import { LoginPageComponent } from './pages/auth/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page.component';
import { ClientesPageComponent } from './pages/admin/clientes-page.component';
import { VehiculosPageComponent } from './pages/admin/vehiculos-page.component';
import { TicketsPageComponent } from './pages/admin/tickets-page.component';
import { PagosFacturasPageComponent } from './pages/admin/pagos-facturas-page.component';
import { MenuPageComponent } from './pages/admin/menu-page.component';

import { authGuard } from './core/services/auth.guard';
import { roleGuard } from './core/services/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },

  {
    path: 'admin',
    component: DashboardAdminPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/clientes',
    component: ClientesPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/vehiculos',
    component: VehiculosPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/tickets',
    component: TicketsPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/pagos-facturas',
    component: PagosFacturasPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'admin/menu',
    component: MenuPageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'cliente',
    component: DashboardClientePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'CLIENTE' }
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];