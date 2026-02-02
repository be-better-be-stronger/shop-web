import { Routes } from '@angular/router';
import { AdminProductFormComponent } from './features/admin/components/product-form/product-form.component';
import { LoginComponent } from './features/auth/login.component/login.component';
import { adminGuard } from './core/guards/admin.guard';
import { AdminProductEditorPageComponent } from './features/admin/components/admin-product-editor/admin-product-editor-page.component';
import { AdminProductListPageComponent } from './features/admin/components/admin-product-list-page/admin-product-list-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/home/home')
        .then(m => m.HomeComponent)
  },


  // demo 403
  { path: '403', loadComponent: () => import('./shared/pages/forbidden.component').then(m => m.ForbiddenComponent) },

  // admin
  { path: 'admin/products', component: AdminProductListPageComponent},
  { path: 'admin/products/new', component: AdminProductEditorPageComponent },
  { path: 'admin/products/:id/edit', component: AdminProductEditorPageComponent },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];