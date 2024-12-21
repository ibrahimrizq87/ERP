import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountingService } from '../../shared/services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-account',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-account.component.html',
  styleUrl: './update-account.component.css'
})
export class UpdateAccountComponent {

  accountForm: FormGroup;
  parentAccounts = []; 
  isLoading = false;
  msgError: string[] = [];
  accountId:string|null =null;
 account:any;
  constructor(private route: ActivatedRoute ,private fb: FormBuilder ,private _AccountingService:AccountingService
    , private _Router: Router,private toastr:ToastrService
  ) {
    this.accountForm = this.fb.group({
      account_name: ['', [Validators.required, Validators.maxLength(255)]], 
      phone: ['', [Validators.maxLength(255)]], 
      current_balance: [0, [Validators.required, Validators.min(0)]], 
      net_debit: [null, [Validators.min(0)]], 
      net_credit: [null, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.accountId = params.get('id'); 
      console.log( this.accountId)
      this.onAccountIdChange(this.accountId); 
    });
    const accountUpdatedId = this.route.snapshot.paramMap.get('accountId'); 
    if (accountUpdatedId) {
      this.fetchAccountData(accountUpdatedId);
    }
    this.getParentAccount(); 
  }

  fetchAccountData(accountUpdatedId: string): void {
    this._AccountingService.getAccountById(accountUpdatedId).subscribe({
      next: (response) => {
        if (response) {
          const AccountData = response.data ; 
          console.log(AccountData)
          this.accountForm.patchValue({
            account_name:AccountData.account_name,
            phone:AccountData.phone,
            current_balance:AccountData.current_balance,
            net_debit:AccountData.net_debit,
            net_credit:AccountData.net_credit,
            // product_id:machineData.product.id,
              
          });
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  getParentAccount(): void {
    this._AccountingService.getParentAccount(this.accountId||'').subscribe({
      next: (response) => {
        if (response) {
          this.account = response.data; 
          console.log(this.account);
  
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  onAccountIdChange(id: string | null): void {
    this.accountId = id;
    this.getParentAccount(); 

      }

  handleForm(): void {
    if (this.accountForm.valid  && this.account) {
      this.isLoading = true;

     


      const formData = new FormData();
            formData.append('account_name', this.accountForm.get('account_name')?.value);
            formData.append('phone', this.accountForm.get('phone')?.value || '');
            formData.append('current_balance', this.accountForm.get('current_balance')?.value||0);
            formData.append('net_debit', this.accountForm.get('net_debit')?.value || 0);
            formData.append('net_credit', this.accountForm.get('net_credit')?.value || 0);
            formData.append('parent_id', this.account.id);

            const accountId = this.route.snapshot.paramMap.get('accountId');
            console.log(accountId)
            if (accountId){
            this._AccountingService.updateAccount(accountId,formData).subscribe({
              next: (response) => {
                console.log(response);
                if (response) {
                  this.toastr.success("Updated Account Successfully")
                  this.isLoading = false;
                  this._Router.navigate(['/dashboard/accounting/'+ this.account.id]);
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


    } else {
      this.msgError = ['Please fill in all required fields correctly.'];
    }
  }
  onCancel(): void {
    this.accountForm.reset();
   
    this._Router.navigate(['/dashboard/accounting/'+ this.account.id]); 
  }  
}