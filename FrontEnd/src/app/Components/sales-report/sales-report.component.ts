import { Component } from '@angular/core';
import { MainReportsService } from '../../shared/services/main_reports.service';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sales-report',
  imports: [CommonModule,FormsModule],
  templateUrl: './sales-report.component.html',
  styleUrl: './sales-report.component.css'
})
export class SalesReportComponent {
  moves: any[] = [];  
  products: any[] = [];  
  filteredProducts :any[]=[]; 
  searchQuery = ''; 
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

 
 
  constructor(private _ReportsService: MainReportsService ) {

  }

  ngOnInit() {
    this.loadReports();
   
   
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
filterDisplayedProducts() {
  if (this.selectedProduct) {
    this.filteredProducts = this.products.filter(
      product => product.account.id === +this.selectedProduct // Ensure type match
    );
  } else {
    this.filteredProducts = [...this.products]; // Reset to the full list
  }
}

filterToday() {
  const filters = { today: true }; 
  console.log('Today filter applied:', filters); 
  this.loadReports(filters);
}

filterThisYear() {
  const filters = { thisYear: true }; 
  console.log('This Year filter applied:', filters); 
  this.loadReports(filters);
}




loadReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean } = {}) {
  console.log('Filters applied in loadReports:', filters); // Debugging
  this._ReportsService.getSalesInvoicesReports(filters).subscribe({
    next: (response) => {
      if (response) {
        console.log('Product reports data:', response[0]);
        this.products = response[0]; // Update the full list
        this.filteredProducts = [...this.products]; // Initialize filtered list
      }
    },
    error: (err) => {
      console.error('Error fetching reports:', err);
    }
  });
}




 


}
