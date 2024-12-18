
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-shift',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-shift.component.html',
  styleUrl: './update-shift.component.css'
})
export class UpdateShiftComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  shiftForm: FormGroup;
  selectedImages: { [key: string]: File | null } = {}; 
  price: number = 0; // Price from machine data
  public totalAmountSum: number = 0; // Sum of all entered amounts (before multiplication)

 public totalOnlinePayment: number = 0;  // Sum of all payments
  paymentResults: number[] = [];   // Individual payment results
  
  clientsResult:number[]=[];
  public total_client_deposit: number = 0;
   public amountTotal: number = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ShiftService: ShiftService,
    private route: ActivatedRoute
  ) {
    this.shiftForm = this.fb.group({
      // amount: [null, [Validators.required, Validators.min(0)]],
      online_payments: this.fb.array([]),  // FormArray for online payments
      client_counters: this.fb.array([])    // FormArray for client counters
    });
  }

  ngOnInit(): void {
    const shiftId = this.route.snapshot.paramMap.get('id');
    if (shiftId) {
      this.fetchShiftData(shiftId);
    }
  }

  fetchShiftData(shiftId: string): void {
    this._ShiftService.getShiftById(shiftId).subscribe({
      next: (response) => {
        console.log('Shift Data:', response); // Debugging log
        if (response) {
          const shiftData = response;
          this.price = parseFloat(response?.data?.machine?.product?.price) || 0;
          console.log(this.price);
          this.setOnlinePayments(shiftData.online_payments);
          this.setClientCounters(shiftData.client_counters);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching shift data:', err); // Debugging log
        this.msgError = err.error.error;
      }
    });
  }

  // setOnlinePayments(onlinePayments: any[]): void {
  //   const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
  
  //   if (!Array.isArray(onlinePayments)) {
  //     onlinePayments = [];
  //   }
  
  //   onlinePayments.forEach(payment => {
  //     onlinePaymentsFormArray.push(this.fb.group({
  //       amount: [payment.amount, [Validators.required, Validators.min(0)]],
  //       client_name: [payment.client_name, [Validators.maxLength(255)]],
  //       image: [payment.image]
  //     }));
  //   });
  //   this.initializePaymentResults();
  // }
  setOnlinePayments(onlinePayments: any[]): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
  
    // Ensure that onlinePayments is always an array
    if (!Array.isArray(onlinePayments)) {
      onlinePayments = [];
    }
  
    // Populate the FormArray with valid data
    onlinePayments.forEach(payment => {
      onlinePaymentsFormArray.push(this.fb.group({
        amount: [payment.amount || null, [Validators.required, Validators.min(0)]],
        client_name: [payment.client_name || null, [Validators.maxLength(255)]],
        image: [payment.image || null]
      }));
    });
    this.initializePaymentResults();
  }
  
 

  // initializePaymentResults(): void {
  //   this.paymentResults = Array(this.onlinePayments.length).fill(0);
  //   this.updatePaymentResults();
  // }
  initializePaymentResults(): void {
    this.paymentResults = Array(this.onlinePayments.length).fill(0);
    this.updatePaymentResults();
    this.calculateTotalAmountSum(); // Calculate the sum of all amounts
  }
  
  calculatePaymentTotal(index: number): void {
    const amount = this.onlinePayments.at(index).get('amount')?.value || 0;
    this.paymentResults[index] = amount * this.price;
    this.updateTotalOnlinePayment(); // Update total after each calculation
  }

  updatePaymentResults(): void {
    this.onlinePayments.controls.forEach((_, index) => this.calculatePaymentTotal(index));
  }

  addOnlinePayment(): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.push(this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      client_name: [null, [Validators.maxLength(255)]],
      image: [null]
    }));
    this.paymentResults.push(0);
    this.calculateTotalAmountSum(); 
  }

  updateTotalOnlinePayment(): void {
    this.totalOnlinePayment = this.paymentResults.reduce((sum, payment) => sum + payment, 0);
    this.updateAmountTotal();
  }
  setClientCounters(clientCounters: any[]): void {
    const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
  
    if (!Array.isArray(clientCounters)) {
      clientCounters = [];
    }
  
    clientCounters.forEach(counter => {
      clientCountersFormArray.push(this.fb.group({
        account_id: [counter.account_id, [Validators.required]],
        amount: [counter.amount, [Validators.required, Validators.min(0)]],
        image: [counter.image]
      }));
    });
    this.initializeClientCounters();

  }

  // initializeClientCounters(): void {
  //   this.clientsResult = Array(this.clientCounters.length).fill(0);
  //   this.updateClientCounter();
  // }
  initializeClientCounters(): void {
    this.clientsResult = Array(this.clientCounters.length).fill(0);
    this.updateClientCounter();
    this.calculateTotalAmountSum(); // Calculate the sum of all amounts
  }

  calculateTotalAmountSum(): void {
    const onlineAmounts = this.onlinePayments.controls
      .map(control => control.get('amount')?.value || 0);
    const clientAmounts = this.clientCounters.controls
      .map(control => control.get('amount')?.value || 0);
    
    this.totalAmountSum = [...onlineAmounts, ...clientAmounts].reduce((sum, amount) => sum + amount, 0);
    console.log('Total sum of all amounts (before multiplication):', this.totalAmountSum);
  }
  

  calculateCounterTotal(index: number): void {
    const amount = this.clientCounters.at(index).get('amount')?.value || 0;
    this.clientsResult[index] = amount * this.price;
    this.updateTotalClientCounter(); // Update total after each calculation
    
  }

  updateClientCounter(): void {
    this.clientCounters.controls.forEach((_, index) => this.calculateCounterTotal(index));
    
  }

  updateTotalClientCounter(): void {
    // Calculate total client deposit by summing up all client counter results
    this.total_client_deposit = this.clientsResult.reduce((sum, result) => sum + result, 0);
    this.updateAmountTotal();
  }

  addClientCounter(): void {
    const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
    clientCountersFormArray.push(this.fb.group({
      account_id: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      image: [null]  // Add any file handling here
    }));
    this.calculateTotalAmountSum(); 
  }

  // removeClientCounter(index: number): void {
  //   const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
  //   clientCountersFormArray.removeAt(index);
  // }

  removeClientCounter(index: number): void {
    const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
    clientCountersFormArray.removeAt(index);
    this.clientsResult.splice(index, 1);  // Remove the result for that counter
    this.updateTotalClientCounter();  // Recalculate the total after removal
    this.calculateTotalAmountSum(); // Update total sum
  }
 
  initializeclientCounters(): void {
    this.clientsResult = Array(this.clientCounters.length).fill(0);
    this.updateClientCounter();
  }
  
  removeOnlinePayment(index: number): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.removeAt(index);
    this.paymentResults.splice(index, 1);  // Remove the result for that payment
    this.updateTotalOnlinePayment();  // Recalculate the total after removal
    this.calculateTotalAmountSum();
  }
  updateAmountTotal(): void {
    this.amountTotal = this.totalOnlinePayment + this.total_client_deposit;
    this.calculateTotalAmountSum();
  }


  // handleForm(): void {
  //   if (this.shiftForm.invalid) {
  //     // Check for specific errors
  //     const errors = this.shiftForm.errors;
  //     console.log('Form is invalid:', errors);
  //     return;
  //   }
  //   // if (this.shiftForm.valid) {
  //     this.isLoading = true;
  //     const formData = new FormData();
  //     formData.append('amount', this.amountTotal.toString());
  //    console.log(this.amountTotal.toString())
  //    formData.append('total_payed_online', this.totalOnlinePayment.toString());
  //    console.log(this.totalOnlinePayment.toString())
  //    formData.append('total_client_deposit',this.total_client_deposit.toString())
  //    console.log(this.total_client_deposit.toString())
  
  //     // Handle Online Payments and Client Counters with images
  //     const onlinePayments = this.shiftForm.get('online_payments')?.value;
  //     console.log(onlinePayments)
  //     onlinePayments.forEach((payment: any, i: number) => {
  //       if (this.selectedImages[`online_payment_${i}`]) {
  //         formData.append('online_payments[]', JSON.stringify(payment));
          
  //         const image = this.selectedImages[`online_payment_${i}`];
  //         if (image) {
  //           formData.append(`online_payment_${i}_image`, image);
  //         }
  //         console.log(image)
  //       }
  //     });
  
  //     const clientCounters = this.shiftForm.get('client_counters')?.value;
  //     clientCounters.forEach((counter: any, i: number) => {
  //       if (this.selectedImages[`client_counter_${i}`]) {
  //         formData.append('client_counters[]', JSON.stringify(counter));
          
  //         const image = this.selectedImages[`client_counter_${i}`];
  //         if (image) {
  //           formData.append(`client_counter_${i}_image`, image);
  //         }
  //       }
  //     });
  
  //     const shiftId = this.route.snapshot.paramMap.get('id');
  //     if (shiftId) {
  //       this._ShiftService.updateShift(shiftId, formData).subscribe({
  //         next: (response) => {
  //           this.isLoading = false;
  //           if (response) {
  //             this.router.navigate(['/dashboard/shifts']);
  //           }
  //         },
  //         error: (err: HttpErrorResponse) => {
  //           this.isLoading = false;
  //           this.msgError = err.error.error;
  //         }
  //       });
  //     }
  //     console.log('Form values before submitting:', this.shiftForm.value);

  //   // }
  // }
  handleForm(): void {
    if (this.shiftForm.invalid) {
      // Log and return errors for debugging
      console.log('Form validation failed:', this.shiftForm.errors);
      this.shiftForm.markAllAsTouched(); // Highlight errors in form
      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
  
    // Append totals
    formData.append('amount', this.totalAmountSum.toString());
    console.log(this.totalAmountSum.toString())
    formData.append('total_payed_online', this.totalOnlinePayment.toString());
    console.log( this.totalOnlinePayment.toString())
    formData.append('total_client_deposit', this.total_client_deposit.toString());
    console.log(this.total_client_deposit.toString())
  
    // Append Online Payments
    this.onlinePayments.controls.forEach((paymentControl, index) => {
      formData.append(`online_payments[${index}][amount]`, paymentControl.get('amount')?.value || '');
      formData.append(`online_payments[${index}][client_name]`, paymentControl.get('client_name')?.value || '');
  
      const image = this.selectedImages[`online_payment_${index}`];
      if (image) {
        formData.append(`online_payments[${index}][image]`, image);
      }
    });
  
    // Append Client Counters
    this.clientCounters.controls.forEach((counterControl, index) => {
      formData.append(`client_counters[${index}][account_id]`, counterControl.get('account_id')?.value || '');
      formData.append(`client_counters[${index}][amount]`, counterControl.get('amount')?.value || '');
  
      const image = this.selectedImages[`client_counter_${index}`];
      if (image) {
        formData.append(`client_counters[${index}][image]`, image);
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
            this.router.navigate(['/dashboard/shifts']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
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

  get clientCounters(): FormArray {
    return this.shiftForm.get('client_counters') as FormArray;
  }

  onFileSelected(event: any, formName: string, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImages[`${formName}_${index}`] = file;
    }
  }
}
