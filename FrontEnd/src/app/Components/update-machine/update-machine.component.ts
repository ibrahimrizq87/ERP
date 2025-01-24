import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../shared/services/product.service';
import { MachineService } from '../../shared/services/machine.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-machine',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-machine.component.html',
  styleUrl: './update-machine.component.css'
})
export class UpdateMachineComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  products:any[]=[];
  machineForm: FormGroup;;
    constructor(
    private fb: FormBuilder,
    private router: Router, 
    private _ProductService:ProductService,
    private _MachineService:MachineService ,
    private route: ActivatedRoute,
    private toastr:ToastrService
  ) {
   
    this.machineForm = new FormGroup({
      machine_number: this.fb.control(null, [Validators.required,Validators.maxLength(255)]),
      product_id: this.fb.control(null, [Validators.required]),
      start_amount: this.fb.control(null, [Validators.required]),

    });
  }
 
    ngOnInit(): void {
    const machineId = this.route.snapshot.paramMap.get('id'); 
    if (machineId) {
      this.fetchMachineData(machineId);
    }
    this.loadProducts();
  }
  fetchMachineData(machineId: string): void {
    this._MachineService.getMachineById(machineId).subscribe({
      next: (response) => {
        if (response) {
          const machineData = response ; 
          console.log(machineData)
          this.machineForm.patchValue({
            machine_number:machineData.machine_number,
            product_id:machineData.product.id,
            start_amount:machineData.start_amount,

          });
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  loadProducts(): void {
    this._ProductService.viewAllProducts().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.products = response; 
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 

  
  handleForm() {
    if (this.machineForm.valid) {
      this.isLoading = true;
      const formData = new FormData();

      formData.append('machine_number', this.machineForm.get('machine_number')?.value);
      formData.append('product_id', this.machineForm.get('product_id')?.value);
      formData.append('start_amount', this.machineForm.get('start_amount')?.value);

      
      const machineId = this.route.snapshot.paramMap.get('id');
      if (machineId){
      this._MachineService.updateMachine(machineId,formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response) {
            this.toastr.success("تم تحديث الطرمبة بنجاح");

            this.router.navigate(['/dashboard/machines']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = err.error.error;
          this.toastr.error("حدث خطأ أثناء تحديث الآلة. الرجاء المحاولة مرة أخرى.");
        }
      });
    }
  }}
  onCancel(): void {
        this.machineForm.reset();
       
        this.router.navigate(['/dashboard/machines']); 
      

      }  
}
