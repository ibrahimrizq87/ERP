import { Component } from '@angular/core';
import {   RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';import { AccountingService } from '../../shared/services/accounts.service';
import { Router ,ActivatedRoute } from '@angular/router';
// import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-accounting',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent {
  constructor (private route: ActivatedRoute , private _AccountingService:AccountingService,private _Router:Router ){}
 accounts:any;
 accountId:string |null = null;
 searchTerm: string = ''; 
 filteredAccounts: any[] = [];

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.accountId = params.get('id'); 
      this.onAccountIdChange(this.accountId); 
    });

    this.getAccounts(); 
  }
  getAccounts(){
   this._AccountingService.getAccountsByParent(this.accountId||'').subscribe({
    next: (response) => {
      if (response) {
        this.accounts = response.data; 
        console.log(this.accounts);
        this.filteredAccounts = [...this.accounts];
      }
    },
    error: (err) => {
      console.error(err);
    }
  });

  }

  onAccountIdChange(id: string | null): void {
this.accountId = id;
this.getAccounts(); 

  }
  filterAccounts() {
    const term = this.searchTerm.toLowerCase();
    this.filteredAccounts = this.accounts.filter((account: { account_name: string; net_debit: { toString: () => string; }; net_credit: { toString: () => string; }; current_balance: { toString: () => string; }; }) =>
      account.account_name.toLowerCase().includes(term) ||
      account.net_debit.toString().toLowerCase().includes(term) ||
      account.net_credit.toString().toLowerCase().includes(term) ||
      account.current_balance.toString().toLowerCase().includes(term)
    );
  }

  deleteAccount(accountID: number): void {
    if (confirm('Are you sure you want to delete this Account?')) {
      this._AccountingService.deleteAccount(accountID).subscribe({
        next: (response) => {
          if (response) {
            this._Router.navigate([`/dashboard/accounting/${this.accountId}`]);
            this.getAccounts();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the product.');
        }
      });
    }
  }

}
