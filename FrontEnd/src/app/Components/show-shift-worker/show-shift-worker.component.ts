import { Component } from '@angular/core';
import {  Router, RouterModule } from '@angular/router';
import { Modal } from 'bootstrap';
import { ShiftService } from '../../shared/services/shift.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-shift-worker',
  imports: [RouterModule],
  templateUrl: './show-shift-worker.component.html',
  styleUrl: './show-shift-worker.component.css'
})
export class ShowShiftWorkerComponent {
  constructor(
    private shiftService: ShiftService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new Modal(modalElement);
      modal.show();
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();
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
  
