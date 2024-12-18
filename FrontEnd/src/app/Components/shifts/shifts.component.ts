import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../shared/services/shift.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shifts',
  imports: [CommonModule,RouterModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {

  shifts: any[] = []; 
  filteredCities: any[] = []; 
  searchQuery: string = ''; 

  constructor(private _ShiftService: ShiftService, private router: Router) {}

  ngOnInit(): void {
    this.loadShifts(); 
  }

  loadShifts(): void {
    this._ShiftService.viewAllShifts().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.shifts = response.data; 
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCities = this.users.filter(city =>
  //     city.city.toLowerCase().includes(query) || city.country.toLowerCase().includes(query)
  //   );
  // }

  deleteShift(shiftId: number): void {
    if (confirm('Are you sure you want to delete this Shift?')) {
      this._ShiftService.deleteShift(shiftId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/shifts']);
            this.loadShifts();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the Shift.');
        }
      });
    }
  }
  // changeStatus(shiftId: number): void {
  //   if (confirm('Are you sure you want to Close this Shift?')) {
  //     this._ShiftService.storeStatusOfShift(shiftId).subscribe({
  //       next: (response) => {
  //         if (response) {
  //           this.router.navigate(['/dashboard/shifts']);
  //           this.loadShifts();
  //         }
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert('An error occurred while Close the Shift.');
  //       }
  //     });
  //   }
  // }
}