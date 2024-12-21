import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../shared/services/machine.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../shared/services/product.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-machine',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './add-machine.component.html',
  styleUrl: './add-machine.component.css'
})
export class AddMachineComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  products:any[]=[];
  constructor(private _MachineService:MachineService , private _Router: Router,private _ProductService:ProductService, private toastr:ToastrService) {
   
  }
  // 'machine_number' => 'required|string|max:255',
  // 'product_id' => 'required|exists:products,id',
  machineForm: FormGroup = new FormGroup({
    machine_number:new FormControl(null, [Validators.required,Validators.maxLength(255)]),
    product_id: new FormControl(null, [Validators.required]),
  
   
  });

  ngOnInit(): void {
    this.loadProducts(); 
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
     
    
     
      this._MachineService.addMachine(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("Created Machine Successfully")
            this.isLoading = false;
            this._Router.navigate(['/dashboard/machines']);
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
      },
      });
    }
  }


}
