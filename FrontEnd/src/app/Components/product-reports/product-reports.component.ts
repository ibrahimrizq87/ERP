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
  selectedProduct: any;  //// Selected month from the dropdown
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

 
 
  constructor(private _ReportsService: MainReportsService) {

  }

  ngOnInit() {
    this.loadReports();
    // this.loadSalesReports();
    // this.loadhiftsReports();
    // this.loadPurchaseInvoiceReports();
    // this.loadExpenceInvoiceReports();
  }
  
  searchDate() {
    if (this.startDate && this.endDate) {
        if (new Date(this.startDate) > new Date(this.endDate)) {
            console.error('Start date must be before the end date.');
            return;
        }
        const filters = { startDate: this.startDate, endDate: this.endDate };
        this.loadReports(filters);
    } else {
        console.warn('Both start date and end date must be selected.');
    }
}

filterByMonth() {
  if (this.selectedMonth) {
      const year = new Date().getFullYear();
      const startDate = `${year}-${this.selectedMonth}-01`;
      const lastDay = new Date(year, parseInt(this.selectedMonth, 10), 0).getDate();
      const endDate = `${year}-${this.selectedMonth}-${lastDay}`;
      const filters = { startDate, endDate };
      console.log('Month filters:', filters); // Debugging
      this.loadReports(filters);
  } else {
      console.warn('Month must be selected.');
  }
}

filterByProduct() {
  if (this.selectedProduct) {
    const productId = this.selectedProduct;
    const filters = { productId };
    console.log('Product filter applied:', filters); // Debugging

    // Load reports but ensure `selectedProduct` is preserved
    this.loadReports(filters);
  } else {
    console.warn('Product must be selected.');
  }
}






loadReports(filters: { startDate?: string; endDate?: string; productId?: string; today?: boolean; thisYear?: boolean } = {}) {
  console.log('Filters applied in loadReports:', filters); // Debugging
  this._ReportsService.getProductReports(filters).subscribe({
    next: (response) => {
      if (response) {
        console.log('Product reports data:', response);
        this.products = response;

        // If `selectedProduct` is set, ensure it matches one of the updated products
        if (this.selectedProduct && !this.products.some(p => p.product.id === this.selectedProduct)) {
          this.selectedProduct = '';
        }
      }
    },
    error: (err) => {
      console.error('Error fetching reports:', err);
    }
  });
}


 


 
}