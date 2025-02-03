import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { Router, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountingService } from '../../shared/services/accounts.service';
import { Modal } from 'bootstrap';
import { Base64 } from 'js-base64';
@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule, RouterLinkActive, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarOpen = false;



  dropdownStates: { [key: string]: boolean } = {};
  constructor(private router: Router, private _AccountingService: AccountingService) { }
  accounts: any;
  userRole: string | null = null;
  // toggleDropdown(navItem: string) {
  //   this.dropdownStates[navItem] = !this.dropdownStates[navItem];
  // }
  // isDropdownOpen(navItem: string): boolean {
  //   return !!this.dropdownStates[navItem];
  // }
  // dropdownStates: { [key: string]: boolean } = {};
  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
  isDropdownOpen(key: string): boolean {
    return this.dropdownStates[key] || false;
  }

  toggleDropdown(key: string): void {
    this.dropdownStates[key] = !this.dropdownStates[key];
  }
  ngOnInit(): void {
    this.getParentAccounts();
    this.getUserRole();
  }

  getParentAccounts() {
    this._AccountingService.getParentAccounts().subscribe({
      next: (response) => {
        if (response) {
          this.accounts = response.data;
          console.log(this.accounts)
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  // getUserRole() {

  //   const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  //   this.userRole = userData.user.role || null; 
  // }
  getUserRole() {
    const encodedRole = localStorage.getItem('userRole');
    if (encodedRole) {
      this.userRole = Base64.decode(encodedRole);
    } else {
      this.userRole = null;
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  navigateAndCloseModal() {
    setTimeout(() => {
      this.closeModal('accountingModal');
    }, 300);
  }

}