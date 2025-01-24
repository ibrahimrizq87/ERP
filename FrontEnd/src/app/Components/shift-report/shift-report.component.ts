import { Component } from '@angular/core';
import { MainReportsService } from '../../shared/services/main_reports.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shift-report',
  imports: [FormsModule ,CommonModule],
  templateUrl: './shift-report.component.html',
  styleUrl: './shift-report.component.css'
})
export class ShiftReportComponent {

  products = []; 
  filteredProducts = []; 
  searchQuery = '';
  startDate: string | null = null; 
  endDate: string | null = null; 
  selectedMonth: string | null = null; 
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
          console.log(response);
   
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onSearch() {
    
  }

  filterByDate() {
    // this.filteredProducts = this.products.filter(product => {
    //   // const productDate = new Date(product.date);
    //   const start = this.startDate ? new Date(this.startDate) : null;
    //   const end = this.endDate ? new Date(this.endDate) : null;

    //   return (
    //     (!start || productDate >= start) &&
    //     (!end || productDate <= end)
    //   );
    // });
  }



  deleteProduct(id: number) {
    // Implement product deletion logic here
    // this.products = this.products.filter(product => product.id !== id);
    // this.filteredProducts = [...this.products];
  }
}