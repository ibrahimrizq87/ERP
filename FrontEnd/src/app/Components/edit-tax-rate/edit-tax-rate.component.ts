import { Component, OnInit } from '@angular/core';
import { AccountingComponent } from '../accounting/accounting.component';
import { AccountingService } from '../../shared/services/accounts.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-tax-rate',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-tax-rate.component.html',
  styleUrl: './edit-tax-rate.component.css'
})
export class EditTaxRateComponent implements OnInit{
  msgError: any[] = [];
  isLoading: boolean = false;
;
  constructor(private _AccountingService:AccountingService , private _Router: Router,private toastr: ToastrService) {
   
  }
 
 
  taxRate: FormGroup = new FormGroup({
    rate:new FormControl(null, [Validators.required,Validators.min(0),Validators.max(100)]),
   
  });
  ngOnInit(): void {
      this.fetchRateData()
  }
  fetchRateData(): void {
    this._AccountingService.getTaxRate().subscribe({
      next: (response) => {
        if (response) {
          const rateData = response ; 
          console.log(rateData)
          this.taxRate.patchValue({
            rate:rateData.rate
          
             
          });
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  handleForm() {
   
    if (this.taxRate.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('rate', this.taxRate.get('rate')?.value);
   
      this._AccountingService.updateTaxRate(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("Update Tax Rate Successfully")
            this.isLoading = false;
            
            this._Router.navigate(['/dashboard/accounting/7']);
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
  }}
