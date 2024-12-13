import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent,RouterOutlet,ReactiveFormsModule,FormsModule,CommonModule,RouterLinkActive,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dropdownStates: { [key: string]: boolean } = {};
  constructor (private router :Router ){}
 
  toggleDropdown(navItem: string) {
    this.dropdownStates[navItem] = !this.dropdownStates[navItem];
  }
  isDropdownOpen(navItem: string): boolean {
    return !!this.dropdownStates[navItem];
  }
}
