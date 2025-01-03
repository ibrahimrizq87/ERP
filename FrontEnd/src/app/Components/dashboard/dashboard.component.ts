import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountingService } from '../../shared/services/accounts.service';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent,RouterOutlet,ReactiveFormsModule,FormsModule,CommonModule,RouterLinkActive,RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dropdownStates: { [key: string]: boolean } = {};
  constructor (private router :Router , private _AccountingService:AccountingService ){}
 accounts:any;
  toggleDropdown(navItem: string) {
    this.dropdownStates[navItem] = !this.dropdownStates[navItem];
  }
  isDropdownOpen(navItem: string): boolean {
    return !!this.dropdownStates[navItem];
  }
  ngOnInit(): void {
    this.getParentAccounts(); 
  }

  getParentAccounts() {
    this._AccountingService.getParentAccounts().subscribe({
      next: (response) => {
        if (response) {
          this.accounts = response.data; 
          console.log( this.accounts)
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


}