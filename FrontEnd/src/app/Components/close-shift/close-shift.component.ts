import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '../../shared/services/shift.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-close-shift',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './close-shift.component.html',
  styleUrl: './close-shift.component.css'
})
export class CloseShiftComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  closeImageUrl: string | null = null;
  price: number = 0;
  openingAmount:number=0;
  totalAmount:number=0;
  totalOnlinePayment: number = 0;
  totalClientCounter:number=0;
  public resultAmount: number=0 
  
  isSubmitDisabled: boolean = false;
  errorMessage: string | null = null;

  formSubscription: Subscription | null = null;
  public totalMoney: number = 0; 
  public totalCash: number = 0; 
  readonly maxImageSize = 2048 * 1024;
  closeForm: FormGroup;;
    constructor(
    private fb: FormBuilder,
    private router: Router, 
    private _ShiftService:ShiftService ,
    private route: ActivatedRoute
  ) {
    this.closeForm = new FormGroup({
      image: this.fb.control(null, [this.validateImage.bind(this)]), 
      ending_amount:this.fb.control(null,[Validators.required,Validators.min(0)])
    });
  }
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.closeForm.patchValue({ image: file });
    }
  }

  validateImage(control: AbstractControl): ValidationErrors | null {
    const file = this.selectedFile;
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }
      if (fileSize > this.maxImageSize) {
        return { fileTooLarge: true };
      }
    }
    return null;
  }
  ngOnInit(): void {
    const closeId = this.route.snapshot.paramMap.get('id'); 
    if (closeId) {
      this.fetchShiftData(closeId);
    }

    const endingAmountControl = this.closeForm.get('ending_amount');
    if (endingAmountControl) {
      this.formSubscription = endingAmountControl.valueChanges.subscribe((endingAmount) => {
        if (endingAmount != null) {
          // Validate endingAmount
          const requiredMinimum = this.openingAmount + this.totalAmount;
          if (endingAmount < requiredMinimum) {
            this.isSubmitDisabled = true;
            this.errorMessage = `Ending Amount must be greater than or equal to ${requiredMinimum}`;
          } else {
            this.isSubmitDisabled = false;
            this.errorMessage = null;
          }

          // Update calculated fields
          this.resultAmount = +endingAmount - this.openingAmount;
          this.totalMoney = this.resultAmount * this.price;
          this.totalCash = this.totalMoney - (this.totalOnlinePayment + this.totalClientCounter);
        } else {
          // Reset values if invalid
          this.resultAmount = 0;
          this.totalMoney = 0;
          this.totalCash = 0;
          this.isSubmitDisabled = true;
          this.errorMessage = "Ending Amount is required";
        }
      });
    }
  }
  //   ngOnInit(): void {
  //   const closeId = this.route.snapshot.paramMap.get('id'); 
  //   if (closeId) {
  //     this.fetchShiftData(closeId);
  //   }

  //   const endingAmountControl = this.closeForm.get('ending_amount');
  //   if (endingAmountControl) {
  //     this.formSubscription = endingAmountControl.valueChanges.subscribe((endingAmount) => {
  //       if (endingAmount != null && this.openingAmount != null) {
  //         this.resultAmount = +endingAmount - this.openingAmount; // Calculate the result
  //         this.totalMoney = this.resultAmount * this.price;      // Calculate totalMoney
  //         this.totalCash = this.totalMoney - (this.totalOnlinePayment + this.totalClientCounter); // Calculate totalCash

  //         console.log("totalMoney:", this.totalMoney);     
  //         console.log("resultAmount:", this.resultAmount);   
  //         console.log("totalCash:", this.totalCash);
  //       } else {
  //         this.resultAmount = 0; // Reset if values are invalid
  //         this.totalMoney = 0;  // Reset totalMoney
  //         this.totalCash = 0;   // Reset totalCash
  //       }
  //     });
  //   } else {
  //     this.formSubscription = null; // Ensure the property is either null or a Subscription
  //   }
  // }
  
  fetchShiftData(userId: string): void {
    this._ShiftService.getShiftById(userId).subscribe({
      next: (response) => {
        if (response) {
          console.log('Shift Data:', response); // Debugging log
          if (response) {
            const shiftData = response;
            console.log(shiftData)
            this.price = parseFloat(response?.data?.machine?.product?.price) || 0;
            console.log("price",this.price);
            this.openingAmount=parseFloat(response?.data?.opening_amount)||0;
            console.log("openingAmount", this.openingAmount);
            this.totalOnlinePayment=parseFloat(response?.data?.total_payed_online)||0;
            console.log("totalOnlinePayment",this.totalOnlinePayment);
            this.totalClientCounter=parseFloat(response?.data?.total_client_deposit);
            console.log("totalClientCounter", this.totalClientCounter);
            this.totalAmount=parseFloat(response?.data?.amount);
            console.log(this.totalAmount)

          }
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  handleForm() {
    if (this.closeForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('amount', this.resultAmount.toString());
      formData.append('ending_amount', this.closeForm.get('ending_amount')?.value);
      formData.append('total_money', this.totalMoney.toString());
      formData.append('total_cash',this.totalCash.toString());
      formData.append('total_payed_online',this.totalOnlinePayment.toString());
      formData.append('total_client_deposit',this.totalClientCounter.toString());
     
      if (this.selectedFile) {
        formData.append('ending_image', this.selectedFile);
      }
      const shiftId = this.route.snapshot.paramMap.get('id');
      if (shiftId){
      this._ShiftService.closeShift(shiftId,formData).subscribe({
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
  }}
  onCancel(): void {
        this.closeForm.reset();
       
        this.router.navigate(['/dashboard/shifts']); 
      } 
      ngOnDestroy(): void {
        // Unsubscribe from form changes
        this.formSubscription?.unsubscribe();
      } 
}



// import { Component, OnInit } from '@angular/core';
// import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ShiftService } from '../../shared/services/shift.service';
// import { HttpErrorResponse } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-close-shift',
//   imports: [CommonModule , ReactiveFormsModule],
//   templateUrl: './close-shift.component.html',
//   styleUrl: './close-shift.component.css'
// })
// export class CloseShiftComponent implements OnInit {
//   msgError: any[] = [];
//   isLoading: boolean = false;
//   closeImageUrl: string | null = null;
//   price: number = 0;
//   openingAmount:number = 0;
//   totalOnlinePayment: number = 0;
//   totalClientCounter: number = 0;
//   public resultAmount: number = 0; // To store the calculated result
//   formSubscription: Subscription | null = null;
//   public totalMoney: number = 0;
//   public totalCash: number = 0; // New variable to calculate total cash

//   readonly maxImageSize = 2048 * 1024;
//   closeForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private router: Router, 
//     private _ShiftService: ShiftService,
//     private route: ActivatedRoute
//   ) {
//     this.closeForm = new FormGroup({
//       image: this.fb.control(null, [this.validateImage.bind(this)]), 
//       ending_amount: this.fb.control(null, [Validators.required, Validators.min(0)])
//     });
//   }

//   selectedFile: File | null = null;

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//       this.closeForm.patchValue({ image: file });
//     }
//   }

//   validateImage(control: AbstractControl): ValidationErrors | null {
//     const file = this.selectedFile;
//     if (file) {
//       const fileType = file.type;
//       const fileSize = file.size;
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
//       if (!allowedTypes.includes(fileType)) {
//         return { invalidFileType: true };
//       }
//       if (fileSize > this.maxImageSize) {
//         return { fileTooLarge: true };
//       }
//     }
//     return null;
//   }

//   ngOnInit(): void {
//     const closeId = this.route.snapshot.paramMap.get('id'); 
//     if (closeId) {
//       this.fetchShiftData(closeId);
//     }

//     const endingAmountControl = this.closeForm.get('ending_amount');
//     if (endingAmountControl) {
//       this.formSubscription = endingAmountControl.valueChanges.subscribe((endingAmount) => {
//         if (endingAmount != null && this.openingAmount != null) {
//           this.resultAmount = +endingAmount - this.openingAmount; // Calculate the result
//           this.totalMoney = this.resultAmount * this.price;      // Calculate totalMoney
//           this.totalCash = this.totalMoney - (this.totalOnlinePayment + this.totalClientCounter); // Calculate totalCash

//           console.log("totalMoney:", this.totalMoney);     
//           console.log("resultAmount:", this.resultAmount);   
//           console.log("totalCash:", this.totalCash);
//         } else {
//           this.resultAmount = 0; // Reset if values are invalid
//           this.totalMoney = 0;  // Reset totalMoney
//           this.totalCash = 0;   // Reset totalCash
//         }
//       });
//     } else {
//       this.formSubscription = null; // Ensure the property is either null or a Subscription
//     }
//   }

//   fetchShiftData(userId: string): void {
//     this._ShiftService.getShiftById(userId).subscribe({
//       next: (response) => {
//         if (response) {
//           console.log('Shift Data:', response); // Debugging log
//           if (response) {
//             const shiftData = response;
//             console.log(shiftData)
//             this.price = parseFloat(response?.data?.machine?.product?.price) || 0;
//             console.log("price", this.price);
//             this.openingAmount = parseFloat(response?.data?.opening_amount) || 0;
//             console.log("openingAmount", this.openingAmount);
//             this.totalOnlinePayment = parseFloat(response?.data?.total_payed_online) || 0;
//             console.log("totalOnlinePayment", this.totalOnlinePayment);
//             this.totalClientCounter = parseFloat(response?.data?.total_client_deposit) || 0;
//             console.log("totalClientCounter", this.totalClientCounter);
//           }
//         }
//       },
//       error: (err: HttpErrorResponse) => {
//         this.msgError = err.error.error;
//       }
//     });
//   }

//   handleForm() {
//     if (this.closeForm.valid) {
//       this.isLoading = true;
//       const formData = new FormData();
//       formData.append('amount', this.resultAmount.toString());
//       formData.append('ending_amount', this.closeForm.get('ending_amount')?.value);
//       formData.append('total_money', this.totalMoney.toString());
     
//       if (this.selectedFile) {
//         formData.append('ending_image', this.selectedFile);
//       }
//       const shiftId = this.route.snapshot.paramMap.get('id');
//       if (shiftId){
//       this._ShiftService.closeShift(shiftId,formData).subscribe({
//         next: (response) => {
//           this.isLoading = false;
//           if (response) {
//             this.router.navigate(['/dashboard/shifts']);
//           }
//         },navigate
//         error: (err: HttpErrorResponse) => {
//           this.isLoading = false;
//           this.msgError = err.error.error;
//         }
//       });
//     }
//   }}
//   onCancel(): void {
//         this.closeForm.reset();
       
//         this.router.(['/dashboard/shifts']); 
//       } 
//       ngOnDestroy(): void {
//         // Unsubscribe from form changes
//         this.formSubscription?.unsubscribe();
//       } 
// }
