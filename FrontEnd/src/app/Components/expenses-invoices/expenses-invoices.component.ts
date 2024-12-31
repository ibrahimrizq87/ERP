import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Router, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-expenses-invoices',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './expenses-invoices.component.html',
  styleUrl: './expenses-invoices.component.css'
})
export class ExpensesInvoicesComponent implements OnInit {
  isLoading = false;
  expenses: any[] = []; 
  filteredExpenses: any[] = [];
  searchQuery: string = '';
  constructor(
  
    private _InvoiceService: InvoiceService
    , private router: Router
  ) {}
  ngOnInit(): void {
 
    this.loadAllExpenses()
  }
  loadAllExpenses(): void {
    this._InvoiceService.viewAllExpenses().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.expenses = response.data; 
          this.filteredExpenses = this.expenses;
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
    if (confirm('Are you sure you want to delete this Expenses?')) {
      this._InvoiceService.deleteExpenses(expenseId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/expensesInvoices`]);
            this.loadAllExpenses();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the Expenses.');
        }
      });
    }
  }
}

