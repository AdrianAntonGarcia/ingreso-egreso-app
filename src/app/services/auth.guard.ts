import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authService: AuthService, private router: Router) {

  }
  canLoad(): Observable<boolean>  {
    /**
     * El take cancela la subscripción cuando llega la primera emision del observable(o más si especificamos más)
     * El tap devuelve una replica del observable que llega
     */
    return this.authService.isAuth().pipe(tap(
      estado => {
        if (!estado) { this.router.navigate(['/login']); }
      }
    ), take(1));
  }

  canActivate(): Observable<boolean> {
    return this.authService.isAuth().pipe(tap(
      estado => {
        if (!estado) { this.router.navigate(['/login']); }
      }
    ));
  }
}
