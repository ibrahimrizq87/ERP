import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sales-invoices',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './sales-invoices.component.html',
  styleUrl: './sales-invoices.component.css'
})
export class SalesInvoicesComponent implements OnInit {
  isLoading = false;
  sales: any[] = []; 
  filteredSales: any[] = [];
  searchQuery: string = '';
  constructor(
  
    private _SalesService: SalesService
    , private router: Router,
    private toastr :ToastrService
  ) {}
  ngOnInit(): void {
 
    this.loadAllExpenses()
  }
  loadAllExpenses(): void {
    this._SalesService.viewAllSalesInvoices().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.sales = response.data; 
          this.filteredSales = this.sales;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  filteredExpense(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSales = this.sales.filter(sale => 
      sale.date.toLowerCase().includes(query) || 
      sale.payment_type.toLowerCase().includes(query)
    );
  }
  deleteSale(salesId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة؟')) {
      this._SalesService.deleteSalesInvoice(salesId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/salesInvoices`]);
            this.loadAllExpenses();
            this.toastr.success("تم حذف الفاتورة بنجاح");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء حذف الفاتورة');
        }
      });
    }
  }

}


