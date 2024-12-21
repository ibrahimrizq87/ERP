import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../shared/services/shift.service';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-shift',
  imports: [CommonModule,RouterLinkActive,RouterModule],
  templateUrl: './show-shift.component.html',
  styleUrl: './show-shift.component.css'
})
export class ShowShiftComponent implements OnInit {
  shiftData: any;
  userData: any;
  onlinePayments: any[] = [];
  clientCounters: any[] = [];
  machineDetails: any;

  constructor(
    private _ShiftService: ShiftService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const shiftId = this.route.snapshot.paramMap.get('id');
    if (shiftId) {
      this.fetchShiftData(shiftId);
    }
  }

  fetchShiftData(shiftId: string): void {
    this._ShiftService.getShiftById(shiftId).subscribe({
      next: (response) => {
        console.log(response)
        this.shiftData = response?.data || {};
        this.userData = this.shiftData?.user || {};
        this.onlinePayments = this.shiftData?.online_payments || [];
        this.clientCounters = this.shiftData?.client_counters || [];
        this.machineDetails = this.shiftData?.machine || {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching shift data:', err.message);
      }
    });
  }
}