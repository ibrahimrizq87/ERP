import { Component, OnInit } from '@angular/core';
import { EquationHistoryService } from '../../shared/services/equation-history.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-equation-history',
  imports: [CommonModule,RouterModule],
  templateUrl: './show-equation-history.component.html',
  styleUrl: './show-equation-history.component.css'
})
export class ShowEquationHistoryComponent implements OnInit {

  equationHistory: any;

  constructor(
    private _EquationHistoryService: EquationHistoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const equationId = this.route.snapshot.paramMap.get('id');
    if (equationId) {
      this.fetchEquationHistory(equationId);
    }
  }

 
  fetchEquationHistory(equationId: string): void {
    this._EquationHistoryService.getEquationHistoryById(equationId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.equationHistory = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Equation History data:', err.message);
      }
    });
  }
  
}