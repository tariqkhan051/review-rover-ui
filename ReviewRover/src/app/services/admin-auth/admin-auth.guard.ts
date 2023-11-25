import { Observable } from 'rxjs';
import {
  CanActivate,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth-service/auth-service.service';
import { SESSION_KEYS } from 'src/helpers/constants';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const isAdminRole =
      sessionStorage.getItem(SESSION_KEYS.IS_ADMIN)?.toLowerCase() === 'true';
    const shouldLogin = this.authService.isTokenExpired() || !isAdminRole;

    if (shouldLogin) {
      this.router.navigate(['/admin/login']);
    }

    return !shouldLogin;
  }
}
