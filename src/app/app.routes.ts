import { Routes } from '@angular/router';
import { AdminProductFormComponent } from './features/admin/components/product-form/product-form.component';
import { LoginComponent } from './core/auth/login.component/login.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // demo 403
  { path: '403', loadComponent: () => import('./shares/pages/forbidden.component').then(m => m.ForbiddenComponent) },

  // admin
  { path: 'admin/products/new', component: AdminProductFormComponent, canActivate: [adminGuard] },

  { path: '', redirectTo: 'admin/products/new', pathMatch: 'full' },
];