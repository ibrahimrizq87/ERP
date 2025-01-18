import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
import { AccountingService } from '../../shared/services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-update-shift-worker',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-shift-worker.component.html',
  styleUrl: './update-shift-worker.component.css'
})
export class UpdateShiftWorkerComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  shiftForm: FormGroup;
  selectedImages: { [key: string]: File | null } = {}; 
  products: any;
  machines: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ShiftService: ShiftService,
    private route: ActivatedRoute,
    private toastr:ToastrService,
    private _ProductService:ProductService
  ) {
    this.shiftForm = this.fb.group({
     
      
      online_payments: this.fb.array([]),  // FormArray for online payments
        
    });
  }

  ngOnInit(): void {
   
    this.loadProducts()
   
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
  onProductChange(product_id: string, index: number): void {
    if (!product_id) return;
  
    this._ShiftService.getMachineByProduct(product_id).subscribe({
      next: (response) => {
        console.log(response)
        this.machines = response.data || [];

        // Assign machines to the corresponding form group's metadata
        const paymentControl = this.onlinePayments.at(index) as FormGroup;
        paymentControl.addControl('machines', this.fb.control(this.machines));
      },
      error: (err) => {
        console.error('Error fetching machines:', err);
      },
    });
  }
  

  setOnlinePayments(onlinePayments: any[]): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    if (!Array.isArray(onlinePayments)) {
      onlinePayments = [];
    }
  
    // Populate the FormArray with valid data
    onlinePayments.forEach(payment => {
      onlinePaymentsFormArray.push(this.fb.group({
        product_id:[payment.product_id],
        client_name: [payment.client_name || null, [Validators.maxLength(255)]],
        image: [payment.image || null]
      }));
    });
   
  }
  
  addOnlinePayment(): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.push(this.fb.group({
      product_id: [null, [Validators.required]],
      machine_id: [null, [Validators.required]], 
      client_name: [null, [Validators.maxLength(255)]],
      image: [null],
      machines: [[]], // Initialize empty machines list
    }));
  }
 

 
  


  
 
 
  
  removeOnlinePayment(index: number): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.removeAt(index);
    
   
  }
  


  handleForm(): void {
    if (this.shiftForm.invalid) {
      // Log and return errors for debugging
      console.log('Form validation failed:', this.shiftForm.errors);
      this.shiftForm.markAllAsTouched(); // Highlight errors in form
      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
  
    
  
    // Append Online Payments
    this.onlinePayments.controls.forEach((paymentControl, index) => {
      formData.append(`online_payments[${index}][product_id]`, paymentControl.get('product_id')?.value || '');
      formData.append(`online_payments[${index}][machine_id]`, paymentControl.get('machine_id')?.value || '');
  
      const image = this.selectedImages[`online_payment_${index}`];
      if (image) {
        formData.append(`online_payments[${index}][image]`, image);
      }
    });
  
   
  
    // Debugging: Log the FormData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
  
  
    const shiftId = this.route.snapshot.paramMap.get('id');
    if (shiftId) {
      this._ShiftService.updateShift(shiftId, formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            this.toastr.success('تم تحديث الوردية بنجاح');

            this.router.navigate(['/dashboard/shifts']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
          this.toastr.error('حدث خطأ، يرجى المحاولة مرة أخرى');

        }
      });
    }
    console.log('Form values before submitting:', this.shiftForm.value);
  }
  

  onCancel(): void {
    this.shiftForm.reset();
    this.router.navigate(['/dashboard/shifts']);
  }

  get onlinePayments(): FormArray {
    return this.shiftForm.get('online_payments') as FormArray;
  }


  onFileSelected(event: any, formName: string, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImages[`${formName}_${index}`] = file;
    }
  }
}
