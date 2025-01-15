import { Component } from '@angular/core';
import {   RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';import { AccountingService } from '../../shared/services/accounts.service';
import { Router ,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// import { ActivatedRoute } from '@angular/router';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-accounting',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './accounting.component.html',
  styleUrl: './accounting.component.css'
})
export class AccountingComponent {
  userRole: string | null = null;
  accountTypes = [
    { id: '1', message: 'النقدية و ما فى حكمها' },
    { id: '2', message: 'مخزون' },
    { id: '3', message: 'الذمم المدينة التجارية' },
    { id: '4', message: 'مصروفات مدفوعة مقدما' },
    { id: '5', message: 'ارصدة مدينة التجارية' },
    { id: '6', message: 'اصراف ذات علاقة مدينة' },
    { id: '7', message: 'ممتلكات و ألات و معدات صافى' },
    { id: '8', message: 'مشروعات تحت التنفيذ' },
    { id: '9', message: 'ذمم دائنة تجارية' },
    { id: '10', message: 'اطراف ذات علاقة دائنة' },
    { id: '11', message: 'ارصدة دائنة اخرى' },
    { id: '13', message: 'المصروفات المستحقة' },
    { id: '14', message: 'قروض طويلة الاجل' },
    { id: '15', message: 'رأس المال' },
    { id: '16', message: 'جارى الشركاء' },
    { id: '17', message: 'ارباح العام' },
    { id: '18', message: 'صافى الايرادات التشغيلية' },
    { id: '19', message: 'تكلفة الايرادات' },
    { id: '20', message: 'التكاليف التشغيلية' },
    { id: '21', message: 'مصاريف بيع و توزيع' },
    { id: '22', message: 'مخصص اهلاك الاصول الثابته' },
    { id: '23', message: 'مصاريف ادارية و عمومية' },
    { id: '24', message: 'ايرادات اخرى' },
    { id: '25', message: 'الزكاة التقديرية' },
    { id: '26', message: 'صافى الايرادات التشخيلية' },
    { id: 'none', message: 'نوع اخر' }
  ];

constructor (private route: ActivatedRoute , private _AccountingService:AccountingService,private _Router:Router ,private toastr :ToastrService){}
 accounts:any;
 accountId:string |null = null;
 searchTerm: string = ''; 
 filteredAccounts: any[] = [];
taxRate:any
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.accountId = params.get('id'); 
      this.onAccountIdChange(this.accountId); 
    });

    this.getAccounts();
    this.getTaxRate() ;
    this.getUserRole();
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
  getTaxRate(){
    this._AccountingService.getTaxRate().subscribe({
     next: (response) => {
       if (response) {
         this.taxRate = response; 
         console.log(this.taxRate);
       
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
    if (confirm('هل أنت متأكد أنك تريد حذف هذا الحساب؟')) {
      this._AccountingService.deleteAccount(accountID).subscribe({
        next: (response) => {
          if (response) {
            this.toastr.success("تم حذف الحساب بنجاح");
            this._Router.navigate([`/dashboard/accounting/${this.accountId}`]);
            this.getAccounts();
          }
        },
        error: (err) => {
          console.error(err);
          alert('حدث خطأ أثناء حذف الحساب.');
        }
      });
    }
  }
  

  getAccountMessage(type: string): string {
    const accountType = this.accountTypes.find((item) => item.id == type);
    console.log(type);
    return accountType ? accountType.message : 'Unknown Type';
  }
  getUserRole() {
    const encodedRole = localStorage.getItem('userRole');
    if (encodedRole) {
      this.userRole = Base64.decode(encodedRole);
    } else {
      this.userRole = null;
    }
  }
}
