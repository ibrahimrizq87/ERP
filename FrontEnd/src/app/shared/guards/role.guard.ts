import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
    constructor(private router: Router) {}
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
      const encodedRole = localStorage.getItem('userRole');
      const userRole = encodedRole ? atob(encodedRole) : null;
  
      if (!userRole) {
        this.router.navigate(['/login']);
        return false;
      }
  
      
      const allowedRoles = route.data['roles'] as Array<string>;
  
      if (allowedRoles && allowedRoles.includes(userRole)) {
        return true;
      }
  
  
      if (userRole === 'admin') {
        this.router.navigate(['/dashboard']);
      } else if (userRole === 'worker' || userRole === 'supervisor'||userRole === 'accountant') {
        this.router.navigate(['/dashboard/shifts']);
      } else {
        this.router.navigate(['/login']);
      }
  
      return false;
    }}