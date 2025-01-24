import { Component, OnInit } from '@angular/core';
import {  Router, RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SalesService } from '../../shared/services/sales.service';

@Component({
  selector: 'app-show-shift-worker',
  imports: [RouterModule,CommonModule],
  templateUrl: './show-shift-worker.component.html',
  styleUrl: './show-shift-worker.component.css'
})
export class ShowShiftWorkerComponent implements OnInit{
  shiftData: any = null;
  noShiftOpened: boolean = false; 
  showInvoice: boolean = false; 
  filteredSales:any;
  constructor(
    private shiftService: ShiftService,
    private toastr: ToastrService,
    private router: Router,
    private salesService:SalesService
  ) {}
ngOnInit(): void {
    this.loadMyShift();

}
  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }
loadInvoices(id:string){
  this.salesService.viewsalesInvoicesByShift(id).subscribe({
    next: (response) => {
      console.log(response.data);
      this.filteredSales = response.data;

    },
    error: (err: HttpErrorResponse) => {
      if (err.status === 404) {
        this.noShiftOpened = true; 
      } else {
        console.error(err);
        this.toastr.error(' حدث مشكلة اثناء ترحيل الوردية ');
      }
    }
  });
}
  showInvoices(){
    this.showInvoice = !this.showInvoice;
  }
  closeShift() {
    this.shiftService.closeMainShift(this.shiftData.id).subscribe({
      next: (response) => {
        this.noShiftOpened = true; 
        this.toastr.success('  تم ترحيل الوردية بنجاح  ');

      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.noShiftOpened = true; 
        } else {
          console.error(err);
          this.toastr.error(' حدث مشكلة اثناء ترحيل الوردية ');
        }
      }
    });
}
  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
    }
  }
  loadMyShift(): void {
    this.shiftService.getMyshift().subscribe({
      next: (response) => {
        console.log(response.data)
        this.shiftData = response.data;
        this.loadInvoices(this.shiftData.id);

        this.noShiftOpened = false; 
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.noShiftOpened = true; 
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
  
  chooseShift(shiftNumber: number) {
    const formData = new FormData();
    formData.append('shift', shiftNumber.toString());

    this.shiftService.addShiftWorker(formData).subscribe({
      next: (response) => {
        console.log(response)
       this.toastr.success('تم إضافة الوردية بنجاح');
       this.router.navigate(['/dashboard/updateShiftWorker']);
        this.closeModal('shiftModal');
       
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error('حدث خطأ أثناء إضافة الوردية');
      }
    });
  }
}
  
