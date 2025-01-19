import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sales-invoices',
  imports: [],
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
          this.filteredExpenses = this.sales;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  filteredExpense(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredExpenses = this.expenses.filter(expense => 
      expense.date.toLowerCase().includes(query) || 
      expense.payment_type.toLowerCase().includes(query)
    );
  }
  deleteExpenses(expenseId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه المصروفات؟')) {
      this._InvoiceService.deleteExpenses(expenseId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/expensesInvoices`]);
            this.loadAllExpenses();
            this.toastr.success("تم حذف المصروف بنجاح");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء حذف المصروفات')
        }
      });
    }
  }
}


