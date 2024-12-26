import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css'
})
export class UpdateProductComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;

  productForm: FormGroup;;
    constructor(
    private fb: FormBuilder,
    private router: Router, 
    private _ProductService:ProductService ,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ) {
   
    this.productForm = new FormGroup({
      name: this.fb.control(null, [Validators.required,Validators.maxLength(255)]),
      price: this.fb.control(null, [Validators.required,Validators.min(0)]),
      amount: this.fb.control(null, [Validators.required,Validators.min(0)]),   
    });
  }
 
    ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id'); 
    if (productId) {
      this.fetchProductData(productId);
    }
  }
  fetchProductData(productId: string): void {
    this._ProductService.getProductById(productId).subscribe({
      next: (response) => {
        if (response) {
          const productData = response ; 
          console.log(productData)
          this.productForm.patchValue({
            name:productData.name,
            price:productData.price,
            amount:productData.amount,
            
           
           
          });
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  
 

  
  handleForm() {
    if (this.productForm.valid) {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('name', this.productForm.get('name')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('amount', this.productForm.get('amount')?.value);
     
     
      const productId = this.route.snapshot.paramMap.get('id');
      if (productId){
      this._ProductService.updateProduct(productId,formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            this.toastr.success("تم تحديث المنتج بنجاح")
            this.router.navigate(['/dashboard/products']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
          this.toastr.error('حدث خطأ، يرجى المحاولة مرة أخرى');
        }
      });
    }
  }}
  onCancel(): void {
        this.productForm.reset();
       
        this.router.navigate(['/dashboard/products']); 
      }  
}
