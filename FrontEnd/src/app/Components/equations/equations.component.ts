import { Component, OnInit } from '@angular/core';
import { EquationService } from '../../shared/services/equation.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equations',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './equations.component.html',
  styleUrl: './equations.component.css'
})
export class EquationsComponent implements OnInit {
  isLoading = false;
  equations: any[] = []; 
  filteredEquations: any[] = [];
  searchQuery: string = '';
  constructor(
  
    private _EquationService: EquationService
    , private router: Router,
    private toastr :ToastrService
  ) {}
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