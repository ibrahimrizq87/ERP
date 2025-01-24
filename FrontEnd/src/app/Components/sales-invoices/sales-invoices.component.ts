import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Base64 } from 'js-base64';
import { HttpErrorResponse } from '@angular/common/http';
import { ShiftService } from '../../shared/services/shift.service';

@Component({
  selector: 'app-sales-invoices',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './sales-invoices.component.html',
  styleUrl: './sales-invoices.component.css'
})
export class SalesInvoicesComponent implements OnInit {
  isLoading = false;
  sales: any[] = []; 
  filteredSales: any[] = [];
  searchQuery: string = '';
  userRole: string | null = null;

  constructor(
  
    private _SalesService: SalesService
    , private router: Router,
    private toastr :ToastrService
    ,private shiftService:ShiftService
  ) {}
  ngOnInit(): void {
    this.getUserRole();
  }


  getUserRole() {
    const encodedRole = localStorage.getItem('userRole');
    if (encodedRole) {
      this.userRole = Base64.decode(encodedRole);
      this.loadAllExpenses(this.userRole);

    } else {
      this.userRole = null;
    }
  }

  loadMyShift(): void {
    this.shiftService.getMyshift().subscribe({
      next: (response) => {
        console.log(response.data)
        this.loadInvoicesForMe(response.data.id);

      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.toastr.warning('لم يتم فتح وردية بعد');

        } else {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء جلب البيانات');
        }
      }
    });
  }


  getPaymentType(type:string){
    if(type == 'debit'){
    return 'آجل';
    }else{
      return 'كاش';
    
    }
  }

loadInvoicesForMe(id:string){

  this._SalesService.viewsalesInvoicesByShift(id).subscribe({
    next: (response) => {
     
      this.sales = response.data; 
            this.filteredSales = this.sales;

    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 404) {
      } else {
        console.error(err);
        this.toastr.error(' حدث مشكلة اثناء ترحيل الوردية ');
      }
    }
  });
}




  loadAllExpenses(role:string): void {
    if(role == 'worker'){
      this.loadMyShift();
    }else{
      this._SalesService.viewAllSalesInvoices().subscribe({
        next: (response) => {
          if (response) {
            console.log(response.data);
            this.sales = response.data; 
            this.filteredSales = this.sales;
          }
        },
        error: (err) => {
          console.error(err);
        }
      });
    }

  }
 
  filteredExpense(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredSales = this.sales.filter(sale => 
      sale.date.toLowerCase().includes(query) || 
      sale.type.toLowerCase().includes(query)||
      sale.tax_amount.toLowerCase().includes(query)
    );
  }
  deleteSale(salesId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الفاتورة؟')) {
      this._SalesService.deleteSalesInvoice(salesId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/salesInvoices`]);
            this.loadAllExpenses(this.userRole||'');
            this.toastr.success("تم حذف الفاتورة بنجاح");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء حذف الفاتورة');
        }
      });
    }
  }

}


