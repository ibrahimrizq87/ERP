import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../shared/services/product.service';
import { AccountingService } from '../../shared/services/accounts.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-expenses-invoices',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-expenses-invoices.component.html',
  styleUrl: './update-expenses-invoices.component.css'
})
export class UpdateExpensesInvoicesComponent  implements OnInit{
  msgError: any[] = [];
  isLoading: boolean = false;
  products: any;
  selectedImage: File | null = null;
  selectedInvoiceImage: File | null = null;
  taxRate: any;
  suppliers: any;
  accounts: any;
  expensesAccounts: any;
  constructor(private _InvoiceService:InvoiceService , private _Router: Router,private toastr:ToastrService,private _ProductService:ProductService,private _AccountingService:AccountingService,private route:ActivatedRoute) {
   
  }

  expensesForm: FormGroup = new FormGroup({
    date: new FormControl(this.getTodayDate()),
    total_cash: new FormControl(null, [Validators.required]),
    payementType: new FormControl(null, [Validators.required]),
    expense_id: new FormControl(null, [Validators.required]),
    account_id: new FormControl(null, [Validators.required]),
    note:new FormControl(null)
  });
  ngOnInit(): void {
    this.loadProducts(); 
    this.getTaxRate();
    this.getExpensesAccount();
    this.expensesForm.addControl(
      'tax_rate',
      new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]) // Accepts numbers with up to 2 decimals
    );
    this.expensesForm.get('payementType')?.valueChanges.subscribe((paymentType) => {
      if (paymentType === 'cash') {
        this.getAccountsByParent('1');
      } else if (paymentType === 'online') {
        this.getAccountsByParent('4'); 
      }
    });
    const expenseId = this.route.snapshot.paramMap.get('id'); 
    if (expenseId) {
      this.fetchExpenseData(expenseId);
    }
  }
  fetchExpenseData(expenseId: string): void {
    this._InvoiceService.getExpensesById(expenseId).subscribe({
      next: (response) => {
        if (response) {
          const expensesData = response.data ; 
          console.log(expensesData)
          this.expensesForm.patchValue({
          
            date:expensesData.date,
            total_cash:expensesData.total_cash,
            account_id:expensesData.account.id,
            expense_id:expensesData.expense.id,
            payementType:expensesData.payment_type,
            note:expensesData.note
          });
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  loadProducts(): void {
    this._ProductService.viewAllProducts().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.products = response; 
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }
  
  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTaxRate(): void {
    this._AccountingService.getTaxRate().subscribe({
      next: (response) => {
        if (response) {
          this.taxRate = parseFloat(response.rate); 
          console.log(this.taxRate);
          this.expensesForm.get('tax_rate')?.setValue(this.taxRate);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
   getAccountsByParent(parentId: string): void {
    this._AccountingService.getAccountsByParent(parentId).subscribe({
      next: (response) => {
        if (response) {
          this.accounts = response.data;
          console.log(`Accounts for parent ${parentId}:`, this.accounts);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  
  getExpensesAccount() {
    this.expensesAccounts = []; 
  
   
    this._AccountingService.getAccountsByParent('5').subscribe({
      next: (response) => {
        if (response) {
          this.expensesAccounts = [...this.expensesAccounts, ...response.data]; 
  
         
          this._AccountingService.getAccountsByParent('6').subscribe({
            next: (response) => {
              if (response) {
                this.expensesAccounts = [...this.expensesAccounts, ...response.data]; 
                console.log('Combined Expenses Accounts:', this.expensesAccounts);
              }
            },
            error: (err) => {
              console.error('Error fetching marketing expenses:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching general and administrative expenses:', err);
      },
    });
  }
  
  get total_cash(): number {
    const total_cash = this.expensesForm.get('total_cash')?.value || 0;
    return total_cash;
  }
  get taxAmount(): number {
    const total = this.total_cash; 
    const taxRate = this.taxRate || 0; 
    return (total * taxRate / 100); 
  }
  get totalAfterTax(): number {
    const total = this.total_cash; 
    const taxAmount = this.taxAmount;
    return total - taxAmount; 
  }
  onInvoiceFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedInvoiceImage = input.files[0];
    }
  }
  handleForm() {
  
    if (this.expensesForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('date', this.expensesForm.get('date')?.value);
      formData.append('total_cash', this.expensesForm.get('total_cash')?.value);
      formData.append('expense_id', this.expensesForm.get('expense_id')?.value);
      formData.append('account_id', this.expensesForm.get('account_id')?.value);
      formData.append('payment_type', this.expensesForm.get('payementType')?.value);
      formData.append('note', this.expensesForm.get('note')?.value);
      formData.append('tax_rate', this.taxRate.toString());
      formData.append('tax_amount', this.taxAmount.toString());
      if (this.expensesForm.get('payementType')?.value === 'online' && this.selectedImage) {
        formData.append('online_payment_image', this.selectedImage);
      }
      if (this.selectedInvoiceImage) {
        formData.append('invoice_image', this.selectedInvoiceImage);
      }
      const expenseId = this.route.snapshot.paramMap.get('id');
      if (expenseId){
      this._InvoiceService.updateExpenses(expenseId,formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم تحديث فاتورة المصاريف بنجاح");
            this.isLoading = false;
            this._Router.navigate(['/dashboard/expensesInvoices']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = [];
      
          if (err.error && err.error.errors) {
             
              for (const key in err.error.errors) {
                  if (err.error.errors[key] instanceof Array) {
                      this.msgError.push(...err.error.errors[key]);
                  } else {
                      this.msgError.push(err.error.errors[key]);
                  }
              }
          }
      
          console.error(this.msgError); 
          this.toastr.error("حدث خطأ أثناء التحديث");
      },
      });
     }
    }
  }
  onCancel(): void {
    this.expensesForm.reset();
   
    this._Router.navigate(['/dashboard/expensesInvoices']); 
  }
}
