import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../../shared/services/accounts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-account',
  imports: [CommonModule,RouterModule],
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.css'
})
export class ShowAccountComponent implements OnInit {

  AccountData: any;
  parentId: string | null = null;
  constructor(
    private _AccountingService: AccountingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('accountId');
    const parentId = this.route.snapshot.paramMap.get('id'); 
    this.parentId = parentId;
    if (accountId) {
      this.fetchAccountData(accountId);
    }
  }

 
  fetchAccountData(accountID: string): void {
    this._AccountingService.getAccountById(accountID).subscribe({
      next: (response) => {
        console.log(response.data);
        this.AccountData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Product data:', err.message);
      }
    });
  }
  
}