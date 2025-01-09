import { Component, OnInit } from '@angular/core';
import { EquationService } from '../../shared/services/equation.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-equation',
  imports: [RouterModule],
  templateUrl: './show-equation.component.html',
  styleUrl: './show-equation.component.css'
})
export class ShowEquationComponent implements OnInit {

  equationData: any;

  constructor(
    private _EquationService: EquationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const equationId = this.route.snapshot.paramMap.get('id');
    if (equationId) {
      this.fetchEquationData(equationId);
    }
  }

 
  fetchEquationData(equationId: string): void {
    this._EquationService.getEquationById(equationId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.equationData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Equation data:', err.message);
      }
    });
  }
  
}