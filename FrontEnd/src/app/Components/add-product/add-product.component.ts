import { Component } from '@angular/core';
import { ProductService } from '../../shared/services/product.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  msgError: any[] = [];
  isLoading: boolean = false;
 
  constructor(private _ProductService:ProductService , private _Router: Router,private toastr:ToastrService) {
   
  }
 
  productForm: FormGroup = new FormGroup({
    name:new FormControl(null, [Validators.required,Validators.maxLength(255)]),
    price: new FormControl(null, [Validators.required,Validators.min(0)]),
    amount: new FormControl(null, [Validators.required,Validators.min(0)]),
    // start_amount: new FormControl(null, [Validators.required,Validators.min(0)]),
  });


 
  handleForm() {
   
    if (this.productForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('amount', this.productForm.get('amount')?.value);
      // formData.append('start_amount', this.productForm.get('start_amount')?.value);
     
      this._ProductService.addProduct(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("تم إنشاء المنتج بنجاح");
            this.isLoading = false;
            this._Router.navigate(['/dashboard/products']);
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
          this.toastr.error("حدث خطأ أثناء إضافة المنتج");
      },
      });
    }
  }
}
