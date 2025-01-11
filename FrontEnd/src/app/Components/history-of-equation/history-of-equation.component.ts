import { Component, OnInit } from '@angular/core';
import { EquationHistoryService } from '../../shared/services/equation-history.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history-of-equation',
  imports: [RouterModule ,CommonModule ,FormsModule],
  templateUrl: './history-of-equation.component.html',
  styleUrl: './history-of-equation.component.css'
})
export class HistoryOfEquationComponent implements OnInit {
  msgError: any[] = [];
  selectedEquationId: number | null = null;
  isLoading = false;
  equationHistory: any[] = []; 
  filteredEquations: any[] = [];
  searchQuery: string = '';

  constructor(
    private _EquationHistoryService: EquationHistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
  
    this.route.params.subscribe(params => {
      const id = +params['id']; 
      this.selectedEquationId = id;
      this.loadFilteredEquationHistory(id);
    });
  }


  loadFilteredEquationHistory(equationId: number): void {
    this._EquationHistoryService.getAllEquationHistory().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.equationHistory = response.data;
          this.filteredEquations = this.equationHistory.filter(
            equation => equation.equation_id.id === equationId
          );
          console.log(this.filteredEquations)
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
    if (confirm('هل أنت متأكد أنك تريد حذف تاريخ هذه المعادلة؟')) {
      this._EquationHistoryService.deleteEquationHistory(equationId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/equationHistory/this.selectedEquationId`]);
            this.loadFilteredEquationHistory(this.selectedEquationId!);
            this.toastr.success("تم حذف تاريخ المعادلة بنجاح");
          }
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('حدث خطأ أثناء حذف تاريخ المعادلة');
        }
      });
    }
  }
}

