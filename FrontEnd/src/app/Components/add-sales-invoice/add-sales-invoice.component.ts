import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountingService } from '../../shared/services/accounts.service';
import { ProductService } from '../../shared/services/product.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-sales-invoice',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-sales-invoice.component.html',
  styleUrl: './add-sales-invoice.component.css'
})
export class AddSalesInvoiceComponent implements OnInit{
  msgError: any[] = [];
  isLoading: boolean = false;
  products: any;
  selectedImage: File | null = null;
  selectedInvoiceImage: File | null = null;
  taxRate: any;
  suppliers: any;
  accounts: any;
  expensesAccounts: any;
  constructor(private _SalesService:SalesService , private _Router: Router,private toastr:ToastrService,private _ProductService:ProductService,private _AccountingService:AccountingService) {
   
  }
//             'address' => 'nullable|string|max:255',
//             'tax_no' => 'nullable|string|max:255',
//             'tax_name' => 'nullable|string|max:255',
//             'client_name' => 'nullable|string|max:255',
//             'phone' => 'nullable|string|max:20',
//             'type' => 'required|in:cash,debit',
//             'date' => 'required|date',
//             'liters' => 'required|integer',
//             'amount' => 'required|numeric',
//             'tax_amount' => 'required|numeric',
//             'tax_rate' => 'required|numeric',
//             'number' => 'required|string|max:255',
//             'account_id' => 'nullable|exists:accounts,id',
//             'main_shift_id' => 'required|exists:main_shifts,id',
  salesForm: FormGroup = new FormGroup({
    address: new FormControl(null, [Validators.maxLength(255)]),
    tax_no: new FormControl(null, [Validators.maxLength(255)]),
    tax_name: new FormControl(null, [Validators.maxLength(255)]),
    client_name: new FormControl(null, [Validators.maxLength(255)]),
    phone: new FormControl(null, [Validators.maxLength(20)]),
    date: new FormControl(this.getTodayDate()),
    type: new FormControl(null, [Validators.required]),
    main_shift_id: new FormControl(null, [Validators.required]),
    account_id: new FormControl(null, [Validators.required]),
   
  });
  ngOnInit(): void {
    this.loadProducts(); 
    this.getTaxRate();
  
    this.salesForm.addControl(
      'tax_rate',
      new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]) // Accepts numbers with up to 2 decimals
    );
    this.salesForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'cash') {
        this.getAccountsByParent('10');
      } else if (type === 'online') {
        this.getAccountsByParent('11'); 
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
          this.salesForm.get('tax_rate')?.setValue(this.taxRate);
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
 

  
  
  get total_cash(): number {
    const total_cash = this.salesForm.get('total_cash')?.value || 0;
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
    // address: new FormControl(null, [Validators.maxLength(255)]),
    // tax_no: new FormControl(null, [Validators.maxLength(255)]),
    // tax_name: new FormControl(null, [Validators.maxLength(255)]),
    // client_name: new FormControl(null, [Validators.maxLength(255)]),
    // phone: new FormControl(null, [Validators.maxLength(20)]),
    // date: new FormControl(this.getTodayDate()),
    // total_cash: new FormControl(null, [Validators.required]),
    // type: new FormControl(null, [Validators.required]),
    // main_shift_id: new FormControl(null, [Validators.required]),
    // account_id: new FormControl(null, [Validators.required]),
    if (this.salesForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('address', this.salesForm.get('address')?.value);
      formData.append('tax_no', this.salesForm.get('tax_no')?.value);
      formData.append('tax_name', this.salesForm.get('tax_name')?.value);
      formData.append('client_name', this.salesForm.get('client_name')?.value);
      formData.append('phone', this.salesForm.get('phone')?.value);
      formData.append('date', this.salesForm.get('date')?.value);
      formData.append('main_shift_id', this.salesForm.get('main_shift_id')?.value);
      formData.append('account_id', this.salesForm.get('account_id')?.value);
      formData.append('type', this.salesForm.get('type')?.value);
     
      formData.append('tax_rate', this.taxRate.toString());
      formData.append('tax_amount', this.taxAmount.toString());
      
      if (this.selectedInvoiceImage) {
        formData.append('invoice_image', this.selectedInvoiceImage);
      }
      this._SalesService.addSalesInvoice(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم إنشاء فاتورة المصاريف بنجاح");
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
          this.toastr.error("حدث خطأ أثناء الإضافة");
      },
      });
    }
  }
}

