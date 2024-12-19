
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentService } from '../../shared/services/document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../shared/services/user.service';
import { AccountingService } from '../../shared/services/accounts.service';

@Component({
  selector: 'app-add-payment-document',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-payment-document.component.html',
  styleUrls: ['./add-payment-document.component.css']
})
export class AddPaymentDocumentComponent implements OnInit {
  users:any[]=[];
  transactionForm: FormGroup;
  // companyAccounts = [
  //   { id: 1, name: 'Company Account A' },
  //   { id: 2, name: 'Company Account B' },
  //   { id: 3, name: 'Company Account C' },
  // ];
  // customerAccounts = [
  //   { id: 1, name: 'Customer Account X' },
  //   { id: 2, name: 'Customer Account Y' },
  //   { id: 3, name: 'Customer Account Z' },
  // ];
  companyAccounts:any[]=[];
  customerAccounts:any[]=[];
  isLoading = false;
  type: any;  
  msgError: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,private _DocumentService:DocumentService,private _Router:Router,private _UserService:UserService,private _AccountingService:AccountingService) {
    this.transactionForm = this.fb.group({
      user_id: [null, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      // type: ['', [Validators.required]],
      receiver_name: ['', [Validators.required, Validators.maxLength(255)]],
      company_account_id: ['', [Validators.required]],
      customer_account_id: ['', [Validators.required]],
      image: [null],
    });
  }

  ngOnInit(): void {
    // Retrieve the 'type' parameter from the URL
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type')!;
      console.log('Received type:', this.type);  // Logs 'recipt' or 'payment' based on URL
    });
    this.loadUsers();
    this.getCustomerAccounts();
    this.getCompanyAccounts();
  }
  loadUsers(): void {
    this._UserService.viewAllUsers().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.users = response.data; 
          // this.filteredCities = this.users;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getCustomerAccounts(){
    this._AccountingService.viewAllCustomerAccounts().subscribe({
     next: (response) => {
       if (response) {
         this.customerAccounts = response.data; 
         console.log(this.customerAccounts);
 
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }
   getCompanyAccounts(){
    this._AccountingService.viewAllCompanyAccounts().subscribe({
     next: (response) => {
       if (response) {
         this.companyAccounts = response.data; 
         console.log(this.companyAccounts);
 
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }
  // handleForm(): void {
  //   if (this.transactionForm.invalid) {
  //     this.transactionForm.markAllAsTouched();
  //     return;
  //   }
  //   this.isLoading = true;

  //   if (this.type === 'recipt') {
  //     console.log('Handling recipt type transaction...');
  //   } else if (this.type === 'payment') {
  //     console.log('Handling payment type transaction...');
  //   }

  //   const formData = new FormData();
  //   Object.entries(this.transactionForm.value).forEach(([key, value]) => {
  //     formData.append(key, value as string | Blob);
  //   });

  //   console.log('Form submitted:', this.transactionForm.value);

  //   // Simulate API call
  //   setTimeout(() => {
  //     this.isLoading = false;
  //     alert('Transaction successfully created!');
  //   }, 2000);
  // }
  // 'id' => $this->id,
  // 'amount' => $this->amount,
  // 'type' => $this->type,
  // 'user_id' => $this->user_id,
  // 'receiver_name' => $this->receiver_name,
  // 'company_account_id' => $this->company_account_id,
  // 'customer_account_id' => $this->customer_account_id,
  // 'image' => $this->image,
  // 'created_at' => $this->created_at,
  // 'updated_at' => $this->updated_at,
  handleForm() {
   
    if (this.transactionForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('amount', this.transactionForm.get('amount')?.value);
  
      
      formData.append('type', this.type);
      formData.append('user_id', this.transactionForm.get('user_id')?.value);
      formData.append('receiver_name', this.transactionForm.get('receiver_name')?.value);
      formData.append('type', this.type);
      formData.append('company_account_id', this.transactionForm.get('company_account_id')?.value);
      formData.append('customer_account_id', this.transactionForm.get('customer_account_id')?.value);
      this._DocumentService.addDocument(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
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
      },
      });
    }
  }
}
