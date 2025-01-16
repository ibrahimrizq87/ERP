
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AccountingService } from '../../shared/services/accounts.service';

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
  price: number = 0; 
  public totalAmountSum: number = 0; 
  public totalOnlinePayment: number = 0;  
  totalAmountOnline:number = 0;
  totalAmountClient:number = 0;


  paymentResults: number[] = [];   
  
  clientsResult:number[]=[];
  public total_client_deposit: number = 0;
   public amountTotal: number = 0;
  accounts: any;
  onlinePay:OnlinePayment[] = [];
  clientPay:ClientPayment[] = [];


  deletePayment(item:OnlinePayment){
    this._ShiftService.deleteOnlinePay(item.id).subscribe({
      next: (response) => {
        console.log('Shift Data:', response); 
        if (response) {
          this.totalOnlinePayment -= item.amount * this.price;
          this.amountTotal-= item.amount * this.price;
          this.onlinePay = this.onlinePay.filter((ele)=> ele.id != item.id)
          this.toastr.success('تم الحزف بنجاح');

        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching shift data:', err); 
        this.msgError = err.error.error;
        this.toastr.error('لقد حدثة مشكلة اثناء حذف هذا العنصر');

      }
    });
  }

  deleteClient(item:any){
    this._ShiftService.deleteClientPay(item.id).subscribe({
      next: (response) => {
        console.log('Shift Data:', response); 
        if (response) {
          this.total_client_deposit -= item.amount* this.price;
          this.amountTotal-= item.amount * this.price;

          this.clientPay = this.clientPay.filter((ele)=> ele.id != item.id)

          this.toastr.success('تم الحزف بنجاح');

        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching shift data:', err); 
        this.msgError = err.error.error;
        this.toastr.error('لقد حدثة مشكلة اثناء حذف هذا العنصر');

      }
    });
  }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _ShiftService: ShiftService,
    private route: ActivatedRoute,
    private toastr:ToastrService,
    private _AccountingService:AccountingService
  ) {
    this.shiftForm = this.fb.group({
      total_cash: [''],
      total_client_deposit: [''],
      total_payed_online: [''],
      online_payments: this.fb.array([]),  
      client_counters: this.fb.array([])   
    });
  }

  ngOnInit(): void {
    const shiftId = this.route.snapshot.paramMap.get('id');
    if (shiftId) {
      this.fetchShiftData(shiftId);
    }
    this.getAccounts()
  }

  fetchShiftData(shiftId: string): void {
    this._ShiftService.getShiftById(shiftId).subscribe({
      next: (response) => {
        console.log('Shift Data:', response); // Debugging log
        if (response) {
          const shiftData = response.data;
          this.price = parseFloat(response?.data?.machine?.product?.price) || 0;
          console.log(this.price);
                  // Patch the online payments data to the form array
        // this.setOnlinePayments(shiftData.online_payments);
        this.onlinePay = shiftData.online_payments;
        
        this.clientPay = shiftData.client_counters;
        this.updateOldValues();

        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching shift data:', err); // Debugging log
        this.msgError = err.error.error;
      }
    });
  }
  getAccounts(){
    this._AccountingService.getAccountsByParent("12").subscribe({
     next: (response) => {
       if (response) {
         this.accounts = response.data; 
         console.log(this.accounts);
       
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }


   updateOldValues(){
    let total =0;
    let totalAmount =0;
    let thisPrice = this.price;
    this.onlinePay.forEach( function (item){
      total += item.amount *thisPrice;
      totalAmount += item.amount;
    })

    this.totalOnlinePayment =total;
     total =0;
    this.clientPay.forEach( function (item){
      total += item.amount *thisPrice;
      totalAmount += item.amount;

    })
    


    this.total_client_deposit =total;
    let currentAmounPrice = this.totalAmountOnline * this.price;
    this.totalOnlinePayment +=currentAmounPrice;

     currentAmounPrice = this.totalAmountClient * this.price;
     this.total_client_deposit +=currentAmounPrice;
      this.amountTotal = (this.total_client_deposit + this.totalOnlinePayment );
   }
 
   
  setOnlinePayments(onlinePayments: any[]): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
      if (!Array.isArray(onlinePayments)) {
      onlinePayments = [];
    }
  
        onlinePayments.forEach(payment => {
      onlinePaymentsFormArray.push(this.fb.group({
        id: [payment.id],

        amount: [+payment.amount || null, [Validators.required, Validators.min(0)]],
        client_name: [payment.client_name || null, [Validators.maxLength(255)]],
        image: [payment.image || null]
      }));
    });
  }
  
 

  calculatePaymentTotal(index: number): void {
    const amount = this.onlinePayments.at(index).get('amount')?.value || 0;
    this.paymentResults[index] = amount * this.price;
    this.calculateTotalAmountSum();

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


  setClientCounters(clientCounters: any[]): void {

    const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
  
    if (!Array.isArray(clientCounters)) {
      clientCounters = [];
    }
  
    clientCounters.forEach(counter => {
      clientCountersFormArray.push(this.fb.group({
        account_id: [counter.account_id, [Validators.required]],
        amount: [+counter.amount, [Validators.required, Validators.min(0)]],
        image: [counter.image]
      }));
    });

  }

  calculateTotalAmountSum(): void {
    const onlineAmounts = this.onlinePayments.controls
      .map(control => control.get('amount')?.value || 0);
    const clientAmounts = this.clientCounters.controls
      .map(control => control.get('amount')?.value || 0);

      this.totalAmountOnline = onlineAmounts.reduce((sum, amount) => sum + amount, 0);
      this.totalAmountClient=clientAmounts.reduce((sum, amount) => sum + amount, 0);
    
    this.totalAmountSum = [...onlineAmounts, ...clientAmounts].reduce((sum, amount) => sum + amount, 0);
    console.log('Total sum of all amounts (before multiplication):', this.totalAmountSum);
    console.log('totalAmountOnline  (before multiplication):', this.totalAmountOnline);
    console.log('totalAmountClient  (before multiplication):', this.totalAmountClient);
    this.updateOldValues();


  }
  

  calculateCounterTotal(index: number): void {
    const amount = this.clientCounters.at(index).get('amount')?.value || 0;
    this.clientsResult[index] = amount * this.price;
    this.calculateTotalAmountSum();
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

  removeClientCounter(index: number): void {
    const clientCountersFormArray = this.shiftForm.get('client_counters') as FormArray;
    clientCountersFormArray.removeAt(index);
    this.clientsResult.splice(index, 1);  // Remove the result for that counter
    this.calculateTotalAmountSum(); // Update total sum
  }
  
  removeOnlinePayment(index: number): void {
    const onlinePaymentsFormArray = this.shiftForm.get('online_payments') as FormArray;
    onlinePaymentsFormArray.removeAt(index);
    this.paymentResults.splice(index, 1);  // Remove the result for that payment
    this.calculateTotalAmountSum();
  }
  updateAmountTotal(): void {
    this.amountTotal = this.totalOnlinePayment + this.total_client_deposit;
    this.calculateTotalAmountSum();
  }


  handleForm(): void {
    if (this.shiftForm.invalid) {
      console.log('Form validation failed:', this.shiftForm.errors);
      this.shiftForm.markAllAsTouched(); // Highlight errors in form
      this.toastr.error('تأكد من ادخال جميع المعلومات لتتمكن من  الحفظ');

      return;
    }
  
    this.isLoading = true;
    const formData = new FormData();
  
    formData.append('amount', this.totalAmountSum.toString());
    console.log(this.totalAmountSum.toString())
    formData.append('total_payed_online', this.totalOnlinePayment.toString());
    console.log( this.totalOnlinePayment.toString())
    formData.append('total_client_deposit', this.total_client_deposit.toString());
    console.log(this.total_client_deposit.toString())
  let send = true;
    this.onlinePayments.controls.forEach((paymentControl, index) => {
      formData.append(`online_payments[${index}][amount]`, paymentControl.get('amount')?.value || '');
      formData.append(`online_payments[${index}][client_name]`, paymentControl.get('client_name')?.value || '');
  
      const image = this.selectedImages[`online_payment_${index}`];
      if (image) {
        formData.append(`online_payments[${index}][image]`, image);
      }
    });
  
  
  if(send){

    this.clientCounters.controls.forEach((counterControl, index) => {
      formData.append(`client_counters[${index}][account_id]`, counterControl.get('account_id')?.value || '');
      formData.append(`client_counters[${index}][amount]`, counterControl.get('amount')?.value || '');
  
      const image = this.selectedImages[`client_counter_${index}`];
      if (image) {
        formData.append(`client_counters[${index}][image]`, image);
      }
    });
  
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

interface OnlinePayment{
  id:number,
  amount:number,
  image:string,
  client_name:string

}
interface ClientPayment{
  id:number,
  amount:number,
  image:string,
  account:Account

}
interface Account{
  
  account_name:string,

}
