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
  renderer: any;
  el: any;
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

  // Recursive function to render accounts and their children
  renderAccountLinks(account: any): string {
    if (account.children && account.children.length > 0) {
      return `
        <li class="nav-item nested">
          <div class="d-flex justify-content-between align-items-center" (click)="toggleDropdown('account_${account.id}')">
            <span>{{ account.account_name }}</span>
            <i [ngClass]="isDropdownOpen('account_${account.id}') ? 'fa-angle-down' : 'fa-chevron-left'" class="fa-solid"></i>
          </div>
          <ul class="nav flex-column ms-3" *ngIf="isDropdownOpen('account_${account.id}')">
            <ng-container *ngFor="let child of account.children">
              <li class="nav-item">
                <a class="nav-link" routerLink="accounting/{{child.id}}">{{ child.account_name }}</a>
              </li>
            </ng-container>
          </ul>
        </li>
      `;
    } else {
      return `<li class="nav-item nested"><a class="nav-link" routerLink="accounting/{{account.id}}">{{account.account_name}}</a></li>`;
    }
  }


}