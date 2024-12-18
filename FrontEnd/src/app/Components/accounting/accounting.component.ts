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
  constructor (private route: ActivatedRoute , private _AccountingService:AccountingService ){}
 accounts:any;
 accountId:string |null = null;


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


  deleteAccount(id:string){}

}
