
import { Component, OnInit } from '@angular/core';
import {  ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../shared/services/sales.service';

@Component({
  selector: 'app-show-supervisor-shift',
  imports: [RouterModule,CommonModule],
  templateUrl: './show-supervisor-shift.component.html',
  styleUrl: './show-supervisor-shift.component.css'
})
export class ShowSupervisorShiftComponent {


  shiftData: any = null;
  showInvoice: boolean = false; 
  filteredSales:any;

  constructor(
    private shiftService: ShiftService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private salesService:SalesService
    
  ) {}


  loadInvoices(id:string){
    this.salesService.viewsalesInvoicesByShift(id).subscribe({
      next: (response) => {
        console.log(response.data);
        this.filteredSales = response.data;
  
      },
      error: (err: HttpErrorResponse) => {
        
          console.error(err);
          this.toastr.error(' حدث مشكلة اثناء ترحيل الوردية ');
        
      }
    });
  }
ngOnInit(): void {

  const shiftId = this.route.snapshot.paramMap.get('id');
  if (shiftId) {
    this.loadShift(shiftId);

  }
    
}
  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  showInvoices(){
    this.showInvoice = !this.showInvoice;
  }
  approve() {
    this.shiftService.approveMainShift(this.shiftData.id).subscribe({
      next: (response) => {
        this.toastr.success('  تم ترحيل الوردية بنجاح  ');
        
        this.loadShift(this.shiftData.id);

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

getPaymentType(type:string){
  if(type == 'debit'){
  return 'آجل';
  }else{
    return 'كاش';
  
  }
}

  loadShift(shiftId:string): void {
    this.shiftService.getMainShiftById(shiftId).subscribe({
      next: (response) => {
        console.log(response.data)
        this.shiftData = response.data;
        this.loadInvoices(this.shiftData.id);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
        } else {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء جلب البيانات');
        }
      }
    });
  }

}
  
