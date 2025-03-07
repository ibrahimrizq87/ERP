import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute,Router} from '@angular/router';
import { AccountingService } from '../../shared/services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

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
      type: ['', [Validators.required]], 

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
            formData.append('type', this.accountForm.get('type')?.value);

            
            this._AccountingService.addAccount(formData).subscribe({
              next: (response) => {
                console.log(response);
                if (response) {
                  this.isLoading = false;
                  this.toastr.success("تم إنشاء الحساب بنجاح");
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
                this.toastr.error('حدث خطأ، يرجى المحاولة مرة أخرى'); 
            },
            });
      



    } else {
      this.msgError = ['يرجى ملء جميع الحقول المطلوبة بشكل صحيح.'];

    }
  }
}
