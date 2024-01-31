import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivateUser(): boolean {
    let canActivate = false;
    this.authService
      .getAuthenticatedUser()
      .pipe(take(1))
      .subscribe(user => {
        if (user) {
          canActivate = true;
        } else {
          this.router.navigate(['login']);
        }
      });
    return canActivate;
  }

  canActivateAdmin(): boolean {
    let canActivate = false;
    this.authService
      .getAuthenticatedUser()
      .pipe(take(1))
      .subscribe(user => {
        if (user?.role === 'admin') {
          canActivate = true;
        } else {
          this.router.navigate(['login']);
        }
      });
    return canActivate;
  }
}

export const AdminGuard: CanActivateFn = (): boolean => {
  return inject(PermissionsService).canActivateAdmin();
};

export const UserGuard: CanActivateFn = (): boolean => {
  return inject(PermissionsService).canActivateUser();
};
