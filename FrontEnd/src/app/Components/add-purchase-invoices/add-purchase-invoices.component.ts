import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';
import { AccountingService } from '../../shared/services/accounts.service';

@Component({
  selector: 'app-add-purchase-invoices',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-purchase-invoices.component.html',
  styleUrl: './add-purchase-invoices.component.css'
})
export class AddPurchaseInvoicesComponent implements OnInit{
  msgError: any[] = [];
  isLoading: boolean = false;
  products: any;
  selectedImage: File | null = null;
  taxRate: any;
  suppliers: any;
  accounts: any;
  constructor(private _InvoiceService:InvoiceService , private _Router: Router,private toastr:ToastrService,private _ProductService:ProductService,private _AccountingService:AccountingService) {
   
  }
 
  purchasesForm: FormGroup = new FormGroup({
    date: new FormControl(this.getTodayDate()),
    product_id: new FormControl(null, [Validators.required]),
    amount:new FormControl(null, [Validators.required,Validators.min(0)]),
    price: new FormControl(null, [Validators.required,Validators.min(0)]),
    payementType: new FormControl(null, [Validators.required]),
    supplier_id: new FormControl(null, [Validators.required]),
    account_id: new FormControl(null, [Validators.required]),
  });
  ngOnInit(): void {
    this.loadProducts(); 
    this.getTaxRate();
    this.getSuppliers();
    this.purchasesForm.addControl(
      'tax_rate',
      new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]) // Accepts numbers with up to 2 decimals
    );
    this.purchasesForm.get('payementType')?.valueChanges.subscribe((paymentType) => {
      if (paymentType === 'cash') {
        this.getAccountsByParent('10'); // Load accounts for cash
      } else if (paymentType === 'online') {
        this.getAccountsByParent('11'); // Load accounts for online
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
          this.taxRate = parseFloat(response.rate); // Convert to a number
          console.log(this.taxRate);
  
          // Update the form control with the tax rate
          this.purchasesForm.get('tax_rate')?.setValue(this.taxRate);
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
  
   getSuppliers(){
    this._AccountingService.getAccountsByParent('22').subscribe({
     next: (response) => {
       if (response) {
         this.suppliers = response.data; 
         console.log(this.suppliers);
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }
  get total(): number {
    const amount = this.purchasesForm.get('amount')?.value || 0;
    const price = this.purchasesForm.get('price')?.value || 0;
    return amount * price;
  }
  get taxAmount(): number {
    const total = this.total; 
    const taxRate = this.taxRate || 0; 
    return (total * taxRate / 100); 
  }
  get totalAfterTax(): number {
    const total = this.total; 
    const taxAmount = this.taxAmount;
    return total - taxAmount; 
  }
 
  handleForm() {
  
    if (this.purchasesForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('date', this.purchasesForm.get('date')?.value);
      formData.append('product_id', this.purchasesForm.get('product_id')?.value);
      formData.append('amount_letters', this.purchasesForm.get('amount')?.value);
      formData.append('price', this.purchasesForm.get('price')?.value);
      formData.append('total_cash', this.total.toString());
      formData.append('supplier_id', this.purchasesForm.get('supplier_id')?.value);
      formData.append('account_id', this.purchasesForm.get('account_id')?.value);
      formData.append('payment_type', this.purchasesForm.get('payementType')?.value);
      formData.append('tax_rate', this.taxRate.toString());
      formData.append('tax_amount', this.taxAmount.toString());
      if (this.purchasesForm.get('payementType')?.value === 'online' && this.selectedImage) {
        formData.append('online_payment_image', this.selectedImage);
      }
      this._InvoiceService.addPurchaseInvoice(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم إنشاء فاتورة الشراء بنجاح");
            this.isLoading = false;
            this._Router.navigate(['/dashboard/purchaseInvoices']);
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
