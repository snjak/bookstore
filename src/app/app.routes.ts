import { Routes } from '@angular/router';
import {
  AdminGuard,
  UserGuard,
} from './authentication/services/permissions.service';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/components/login/login.component').then(
        mod => mod.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./authentication/components/register/register.component').then(
        mod => mod.RegisterComponent
      ),
  },
  {
    path: 'bookstore',
    loadComponent: () =>
      import('./bookstore/components/bookstore/bookstore.component').then(
        mod => mod.BookStoreComponent
      ),
    canActivate: [UserGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./bookstore/components/admin/admin.component').then(
        mod => mod.AdminComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/edit-book/:bookId',
    loadComponent: () =>
      import('./bookstore/components/admin/edit-book/edit-book.component').then(
        mod => mod.EditBookComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/add-book',
    loadComponent: () =>
      import('./bookstore/components/admin/add-book/add-book.component').then(
        mod => mod.AddBookComponent
      ),
    canActivate: [AdminGuard],
  },
  { path: '', pathMatch: 'full', redirectTo: 'bookstore' },
];
