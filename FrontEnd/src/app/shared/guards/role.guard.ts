import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private _UserService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const allowedRoles = route.data['roles'] as Array<string>;
    const userRole = this._UserService.getUserRole(); 

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

   
    this.router.navigate(['/login']);
    return false;
  }
}
