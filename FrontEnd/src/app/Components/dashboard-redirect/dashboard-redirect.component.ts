import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-redirect',
  imports: [],
  templateUrl: './dashboard-redirect.component.html',
  styleUrl: './dashboard-redirect.component.css'
})
export class DashboardRedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const encodedRole = localStorage.getItem('userRole');
    const userRole = encodedRole ? atob(encodedRole) : null;

    if (userRole === 'admin') {
      this.router.navigate(['/dashboard/users']);
    } else if (userRole === 'worker' || userRole === 'supervisor'||userRole === 'accountant') {
      this.router.navigate(['/dashboard/shifts']);
    } else {
      this.router.navigate(['/login']);
    }
  }}
