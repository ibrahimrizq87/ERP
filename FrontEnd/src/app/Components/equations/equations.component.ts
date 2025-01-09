import { Component, OnInit } from '@angular/core';
import { EquationService } from '../../shared/services/equation.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { EquationHistoryService } from '../../shared/services/equation-history.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-equations',
  imports: [CommonModule,FormsModule,RouterModule,ReactiveFormsModule],
  templateUrl: './equations.component.html',
  styleUrl: './equations.component.css'
})
export class EquationsComponent implements OnInit {
  msgError: any[] = [];
  getTodayDate(): any {
    new Date().getFullYear();
  }
  selectedEquationId: number | null = null;
  isLoading = false;
  equations: any[] = []; 
  filteredEquations: any[] = [];
  searchQuery: string = '';
 

  constructor(
  
    private _EquationService: EquationService,
    private _EquationHistoryService:EquationHistoryService
    , private router: Router,
    private toastr :ToastrService
  ) {}
  equationHistory: FormGroup = new FormGroup({
   
    year: new FormControl(null, [
      Validators.min(2000), 
      Validators.max(new Date().getFullYear()), 
      Validators.pattern(/^\d+$/)
    ])
  });
  ngOnInit(): void {
 
    this.loadAllequations()
  }
  loadAllequations(): void {
    this._EquationService.getAllEquation().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.equations = response.data; 
          this.filteredEquations = this.equations;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  openModal(modalId: string, equationId: number) {
    this.selectedEquationId = equationId; // Set the selected equation ID.
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

  filteredEquation(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEquations = this.equations.filter(equation => 
      equation.collection_id.toLowerCase().includes(query) || 
      equation.base_id.toLowerCase().includes(query)||
      equation.first_price.toLowerCase().includes(query)||
      equation.current_price.toLowerCase().includes(query)||
      equation.number_of_periods.toLowerCase().includes(query)
    );
  }
  submitHistoryForm(): void {
    if (this.equationHistory.valid) {
      this.isLoading = true;
  
      // Log the form control value directly
      const yearValue = this.equationHistory.get('year')?.value;
      console.log('Year value from form control:', yearValue); // Log here
  
      const formData = new FormData();
      // Append after ensuring it's a string
      formData.append('year', String(yearValue));
  
      if (this.selectedEquationId !== null) {
        formData.append('equation_id', this.selectedEquationId.toString());
      }
  
      this._EquationHistoryService.addEquationHistory(formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.toastr.success("Add Equation history successfully");
            this.isLoading = false;
            this.router.navigate(['/dashboard/equations']);
            this.closeModal('historyModal');
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
  
  deleteEquations(equationId: number): void {
    if (confirm('Are You sure to delete this Equation')) {
      this._EquationService.deleteEquation(equationId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/equations`]);
            this.loadAllequations();
            this.toastr.success(  "Deleted Equation Successfully");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(' Equation حدث خطأ أثناء حذف ')
        }
      });
    }
  }}