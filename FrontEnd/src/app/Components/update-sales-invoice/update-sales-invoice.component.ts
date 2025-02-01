import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../shared/services/product.service';
import { AccountingService } from '../../shared/services/accounts.service';
import { ShiftService } from '../../shared/services/shift.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-sales-invoice',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-sales-invoice.component.html',
  styleUrl: './update-sales-invoice.component.css'
})
export class UpdateSalesInvoiceComponent implements OnInit{
  msgError: any[] = [];
  isLoading: boolean = false;
  products: any;
  selectedImage: File | null = null;
  selectedInvoiceImage: File | null = null;
  taxRate: any;
  suppliers: any;
  accounts: any;
  expensesAccounts: any;
  shiftDataId: any = null;
  noShiftOpened: boolean = false; 
  selectedProductPrice: string = '';
  // amount: number = 0;
  constructor(private _SalesService:SalesService , private _Router: Router,private toastr:ToastrService,private _ProductService:ProductService,private _AccountingService:AccountingService,private _ShiftService:ShiftService,private route: ActivatedRoute,) {
   
  }

  salesForm: FormGroup = new FormGroup({
    address: new FormControl(null, [Validators.maxLength(255)]),
    tax_no: new FormControl(null, [Validators.maxLength(255)]),
    tax_name: new FormControl(null, [Validators.maxLength(255)]),
    client_name: new FormControl(null, [Validators.maxLength(255)]),
    phone: new FormControl(null, [Validators.maxLength(20)]),
    date: new FormControl(this.getTodayDate()),
    type: new FormControl(null, [Validators.required]),
    // number: new FormControl(null, [Validators.required]),
    account_id: new FormControl(null),
    liters: new FormControl(null, [Validators.required]),
    product_id: new FormControl(null, [Validators.required]),
    
  });
  ngOnInit(): void {
    this.loadProducts(); 
    this.getTaxRate();
    this.loadMyShift()
    this.trackProductSelection();
    // this.updateAmount();
  
    this.salesForm.addControl(
      'tax_rate',
      new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]) // Accepts numbers with up to 2 decimals
    );
    this.salesForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'debit') {
        this.getAccountsByParent('12');
      } 
    });
    const saleId = this.route.snapshot.paramMap.get('id'); 
    if (saleId) {
      this.fetcSaleData(saleId);
    }
  }
  fetcSaleData(saleId: string): void {
    this._SalesService.getSalesInvoice(saleId).subscribe({
      next: (response) => {
        if (response) {
          const saleData = response.data; 
          console.log(saleData)
          this.salesForm.patchValue({
            tax_no:saleData.tax_no,
            tax_name:saleData.tax_name,
            client_name:saleData.client_name,
            phone:saleData.phone,
            date:saleData.date,
            type:saleData.type,
            // number:saleData.number,
            account_id:saleData?.account?.id,
            liters:saleData.liters,
            product_id:saleData.product_id,
            address:saleData.address
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
        this.products = response;

      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  trackProductSelection(): void {
    this.salesForm.get('product_id')?.valueChanges.subscribe((selectedProductId) => {
      console.log('Selected Product ID:', selectedProductId);
      
      if (!this.products || this.products.length === 0) {
        console.error('Products are not loaded or empty.');
        return;
      }
  
      const selectedProduct = this.products.find(
        (product: { id: any }) => product.id === +selectedProductId 
      );
  
      if (selectedProduct) {
        this.selectedProductPrice = selectedProduct.price;
        // this.updateAmount()
        console.log('Selected Product Price:', +this.selectedProductPrice);
      } else {
        console.error('Selected product not found.');
      }
    });
  }


  // updateAmount(): void {
  //   // Update the amount whenever liters or product price changes
  //   this.salesForm.get('liters')?.valueChanges.subscribe((liters) => {
  //     this.calculateAmount(liters, this.selectedProductPrice);
  //     console.log(liters)
  //   });
  // }

  // calculateAmount(liters: string, price: string): void {
  //   const parsedPrice = parseFloat(price || '0');
  //   const parsedLiters = parseFloat(liters ||'0' );
  //   this.amount = parsedLiters * parsedPrice;
  //   console.log('Calculated Amount:', this.amount);
  // }

  
  

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
  loadMyShift(): void {
    this._ShiftService.getMyshift().subscribe({
      next: (response) => {
        console.log(response.data)
        this.shiftDataId = response.data.id;
        console.log(this.shiftDataId)
        this.noShiftOpened = false; 
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.noShiftOpened = true; 
        } else {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء جلب البيانات');
        }
      }
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
 

  
  get amount(): number {
    const amount = this.salesForm.get('liters')?.value || 0;
    return amount * +this.selectedProductPrice;
  }

  get taxAmount(): number {
    const amount = this.amount; 
    const taxRate = this.taxRate || 0; 
    return (amount * taxRate / 100); 
  }
  // get totalAfterTax(): number {
  //   const total = this.total_cash; 
  //   const taxAmount = this.taxAmount;
  //   return total - taxAmount; 
  // }
  onInvoiceFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedInvoiceImage = input.files[0];
    }
  }
  handleForm() {
  
    if (this.salesForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('address', this.salesForm.get('address')?.value);
      formData.append('tax_no', this.salesForm.get('tax_no')?.value);
      formData.append('tax_name', this.salesForm.get('tax_name')?.value);
      formData.append('client_name', this.salesForm.get('client_name')?.value);
      formData.append('phone', this.salesForm.get('phone')?.value);
      formData.append('date', this.salesForm.get('date')?.value);
      formData.append('product_id', this.salesForm.get('product_id')?.value);
      formData.append('main_shift_id', this.shiftDataId.toString());
      // formData.append('number', this.salesForm.get('number')?.value);
      formData.append('type', this.salesForm.get('type')?.value);
      formData.append('liters', this.salesForm.get('liters')?.value);
      formData.append('amount', (this.amount + this.taxAmount).toString());
      formData.append('tax_rate', this.taxRate.toString());
      formData.append('tax_amount', this.taxAmount.toString());
      if (this.salesForm.get('type')?.value === 'debit') {
        formData.append('account_id', this.salesForm.get('account_id')?.value);
      }
      const saleId = this.route.snapshot.paramMap.get('id');
      if (saleId){
      this._SalesService.updateSalesInvoice(saleId,formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم تحديث فاتورة المبيعات بنجاح");
            this.isLoading = false;
            this._Router.navigate(['/dashboard/salesInvoices']);
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
  onCancel(): void {
    this.salesForm.reset();
   
    this._Router.navigate(['/dashboard/salesInvoices']); 
  }  
}

