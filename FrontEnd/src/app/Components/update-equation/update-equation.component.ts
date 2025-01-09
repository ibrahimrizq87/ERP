import { Component, OnInit } from '@angular/core';
import { EquationService } from '../../shared/services/equation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountingService } from '../../shared/services/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-equation',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './update-equation.component.html',
  styleUrl: './update-equation.component.css'
})
export class UpdateEquationComponent implements OnInit {
  msgError: any[] = [];
  isLoading: boolean = false;
  products:any[]=[];
  accounts: any;
  collections: any;
  bases: any;
  constructor(private _EquationService:EquationService , private _Router: Router,private _AccountingService:AccountingService, private toastr:ToastrService,private route: ActivatedRoute) {
   
  }
  
  equationForm: FormGroup = new FormGroup({
    first_price:new FormControl(null, [Validators.required,Validators.min(0)]),
    current_price:new FormControl(null, [Validators.required,Validators.min(0)]),
    number_of_periods:new FormControl(null, [Validators.required,Validators.min(0)]),
    collection_id: new FormControl(null, [Validators.required]),
    base_id: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    const equationId = this.route.snapshot.paramMap.get('id'); 
    if (equationId) {
      this.fetchEquationData(equationId);
    }
    this.getCollections();
    this.getBases(); 
  }

  fetchEquationData(equationId: string): void {
    this._EquationService.getEquationById(equationId).subscribe({
      next: (response) => {
        console.log('Equation Response:', response.data);
        if (response) {
          const equationData = response.data;
          this.equationForm.patchValue({
            first_price: equationData.first_price,
            current_price: equationData.current_price,
            number_of_periods: equationData.number_of_periods,
            collection_id: equationData.collection_id?.id, 
            base_id: equationData.base_id?.id,             
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      },
    });
  }
  
  getCollections(): void {
    this._AccountingService.getAccountsByParent('25').subscribe({
      next: (response) => {
        if (response) {
          this.collections = response.data;
          console.log(`Accounts for parent ${25}:`, this.collections);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getBases(): void {
    this._AccountingService.getAccountsByParent('2').subscribe({
      next: (response) => {
        if (response) {
          this.bases = response.data;
          console.log(`Accounts for parent ${2}:`, this.bases);
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  handleForm() {
   
    if (this.equationForm.valid) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('first_price', this.equationForm.get('first_price')?.value);
      formData.append('current_price', this.equationForm.get('current_price')?.value);
      formData.append('number_of_periods', this.equationForm.get('number_of_periods')?.value);
      formData.append('collection_id', this.equationForm.get('collection_id')?.value);
      formData.append('base_id', this.equationForm.get('base_id')?.value);
    
      const equationId = this.route.snapshot.paramMap.get('id');
      if (equationId){
      this._EquationService.updateEquation(equationId,formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("Update Equation Successfully");
            this.isLoading = false;
            this._Router.navigate(['/dashboard/equations']);
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
          this.toastr.error(" Equationحدث خطأ أثناء إنشاء ");
      },
      });
      }
    }
  }
  onCancel(): void {
    this.equationForm.reset();
   
    this._Router.navigate(['/dashboard/equations']); 
  

  } 

}

