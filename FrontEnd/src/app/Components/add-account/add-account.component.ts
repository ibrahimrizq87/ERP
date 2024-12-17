import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute,Router} from '@angular/router';
import { AccountingService } from '../../shared/services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-account',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './add-account.component.html',
  styleUrl: './add-account.component.css'
})
export class AddAccountComponent {

  accountForm: FormGroup;
  parentAccounts = []; 
  isLoading = false;
  msgError: string[] = [];
  accountId:string|null =null;
 account:any;
  constructor(private route: ActivatedRoute ,private fb: FormBuilder ,private _AccountingService:AccountingService
    , private _Router: Router
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
      this.onAccountIdChange(this.accountId); 
    });

    this.getParentAccount(); 
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

           
            this._AccountingService.addAccount(formData).subscribe({
              next: (response) => {
                console.log(response);
                if (response) {
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
      



    } else {
      this.msgError = ['Please fill in all required fields correctly.'];
    }
  }
}
