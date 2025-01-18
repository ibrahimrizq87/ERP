import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
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
     
      
      online_payments: this.fb.array([]),  
        
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
  
    // Find the selected product by ID
    const selectedProduct = this.products.find((product: any) => product.id === parseInt(product_id));
    if (selectedProduct) {
      // Set the start_amount in the form
      const paymentControl = this.onlinePayments.at(index) as FormGroup;
      paymentControl.get('start_amount')?.setValue(selectedProduct.start_amount || 0);
      paymentControl.get('price')?.setValue(selectedProduct.price || 0);
    }
  
    // Fetch machines related to the product (if applicable)
    this._ShiftService.getMachineByProduct(product_id).subscribe({
      next: (response) => {
        console.log(response);
        this.machines = response.data || [];
  
        // Update machines in the form group
        const paymentControl = this.onlinePayments.at(index) as FormGroup;
        paymentControl.addControl('machines', this.fb.control(this.machines));
      },
      error: (err) => {
        console.error('Error fetching machines:', err);
      },
    });
  }
  

 
  
  addOnlinePayment(): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    const newPaymentGroup = this.fb.group({
      product_id: [null, [Validators.required]],
      machine_id: [null, [Validators.required]],
      start_amount: [0], 
      total_money:[0],
      price: [0], 
      close_amount: [null, [Validators.required]],
      total_liters: [0], 
      image: [null],

    });

    newPaymentGroup.get('close_amount')?.valueChanges.subscribe(() => {
      this.updateTotalLiters(newPaymentGroup);
    });

    onlinePaymentsFormArray.push(newPaymentGroup);
  }

  updateTotalLiters(paymentGroup: FormGroup): void {
    const startAmount = paymentGroup.get('start_amount')?.value || 0;
    const closeAmount = paymentGroup.get('close_amount')?.value || 0;
    const price=paymentGroup.get('price')?.value || 0;
    const totalLiters = closeAmount - startAmount;
    const total_money=totalLiters*price
    paymentGroup.get('total_liters')?.setValue(totalLiters, { emitEvent: false });
    paymentGroup.get('total_money')?.setValue(total_money, { emitEvent: false });
    console.log(`Total liters calculated: ${totalLiters}`);
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
  
  
    this.onlinePayments.controls.forEach((paymentControl, index) => {
      formData.append(`machines[${index}][product_id]`, paymentControl.get('product_id')?.value || '');
      formData.append(`machines[${index}][machine_id]`, paymentControl.get('machine_id')?.value || '');
      formData.append(`machines[${index}][close_amount]`, paymentControl.get('close_amount')?.value || '');
      formData.append(`machines[${index}][total_liters]`, paymentControl.get('total_liters')?.value || '');
      formData.append(`machines[${index}][total_money]`, paymentControl.get('total_money')?.value || '');
      const image = this.selectedImages[`online_payment_${index}`];
      console.log("image", image);
      if (image) {
        formData.append(`machines[${index}][close_image]`, image);
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
      // Store the file with a consistent key format
      this.selectedImages[`${formName}_${index}`] = file;
      // console.log(`Selected image for ${formName}_${index}:`, file);
    }
  }
  
}
