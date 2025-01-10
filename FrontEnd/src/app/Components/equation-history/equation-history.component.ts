import { Component, OnInit } from '@angular/core';
import { EquationHistoryService } from '../../shared/services/equation-history.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-equation-history',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './equation-history.component.html',
  styleUrl: './equation-history.component.css'
})
export class EquationHistoryComponent implements OnInit {
  msgError: any[] = [];
  getTodayDate(): any {
    new Date().getFullYear();
  }
  selectedEquationId: number | null = null;
  isLoading = false;
  equationHistory: any[] = []; 
  filteredEquations: any[] = [];
  searchQuery: string = '';
 

  constructor(
  
    private _EquationHistoryService:EquationHistoryService
    , private router: Router,
    private toastr :ToastrService
  ) {}
 
  ngOnInit(): void {
 
    this.loadAllequationHistory()
  }
  loadAllequationHistory(): void {
    this._EquationHistoryService.getAllEquationHistory().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.equationHistory = response.data; 
          this.filteredEquations = this.equationHistory;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
  
  filteredEquation(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredEquations = this.equationHistory.filter(equation => 
      equation?.year?.toString().toLowerCase().includes(query) 
    );
  }
  
  
  deleteEquationHistory(equationId: number): void {
    if (confirm('Are You sure to delete this Equation History')) {
      this._EquationHistoryService.deleteEquationHistory(equationId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/equationHistory`]);
            this.loadAllequationHistory();
            this.toastr.success(  "Deleted Equation History Successfully");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error(' Equation History حدث خطأ أثناء حذف ')
        }
      });
    }
  }}
