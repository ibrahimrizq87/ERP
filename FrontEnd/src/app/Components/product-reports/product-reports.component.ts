import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MainReportsService } from '../../shared/services/main_reports.service';


@Component({
  selector: 'app-product-reports',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './product-reports.component.html',
  styleUrl: './product-reports.component.css'
})
export class ProductReportsComponent {
  moves: any[] = [];  
  products: any[] = [];  // List of all products fetched from the API
  filteredProducts = []; // Filtered list of products
  searchQuery = ''; // Search input
  startDate: string | null = null; // Selected start date
  endDate: string | null = null; // Selected end date
  selectedMonth: string | null = null; // Selected month from the dropdown
  months = [
    { value: '01', label: 'يناير' },
    { value: '02', label: 'فبراير' },
    { value: '03', label: 'مارس' },
    { value: '04', label: 'أبريل' },
    { value: '05', label: 'مايو' },
    { value: '06', label: 'يونيو' },
    { value: '07', label: 'يوليو' },
    { value: '08', label: 'أغسطس' },
    { value: '09', label: 'سبتمبر' },
    { value: '10', label: 'أكتوبر' },
    { value: '11', label: 'نوفمبر' },
    { value: '12', label: 'ديسمبر' }
  ];
 
  searchDate(){}
  filterByMonth() {
    const year = new Date().getFullYear(); 
    const startDate = new Date(`${year}-${this.selectedMonth}-01`); 
    const endDate = new Date(startDate); 
    endDate.setMonth(startDate.getMonth() + 1); 
    endDate.setDate(0); 

  
  }
  constructor(private _ReportsService: MainReportsService) {

  }

  ngOnInit() {
    this.loadReports();
    this.loadSalesReports();
    this.loadhiftsReports();
    this.loadPurchaseInvoiceReports();
    this.loadExpenceInvoiceReports();
  }
  
  
  loadExpenceInvoiceReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
    this._ReportsService.getExpencesInvoicesReports(filters).subscribe({
      next: (response) => {
        if (response) {
          console.log('expense invoice data: ',response);
   
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  loadPurchaseInvoiceReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
    this._ReportsService.getPurchaseInvoicesReports(filters).subscribe({
      next: (response) => {
        if (response) {
          console.log('purchase invoice data: ',response);
   
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  
  loadhiftsReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
    this._ReportsService.getShiftReports(filters).subscribe({
      next: (response) => {
        if (response) {
          console.log('shifts data: ',response);
   
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  loadSalesReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
    this._ReportsService.getSalesInvoicesReports(filters).subscribe({
      next: (response) => {
        if (response) {
          console.log('sales: ',response);
   
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
    this._ReportsService.getProductReports(filters).subscribe({
      next: (response) => {
        if (response) {
          console.log("hi",response);
           this.products=response
           this.moves
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

 


 
}