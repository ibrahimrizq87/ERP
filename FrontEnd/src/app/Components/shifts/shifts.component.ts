import { Component, OnInit } from '@angular/core';
import { ShiftService } from '../../shared/services/shift.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shifts',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './shifts.component.html',
  styleUrl: './shifts.component.css'
})
export class ShiftsComponent implements OnInit {

  shifts: any[] = []; 
   filteredShifts: any[] = [];  
  searchQuery: string = ''; 
  currentStatus: string = 'open';
  private statusFlow: string[] = ['open', 'closed', 'approved'];
  constructor(private _ShiftService: ShiftService, private router: Router,private toastr :ToastrService) {}

  ngOnInit(): void {
    // this.loadShifts(); 
    this.loadShifts(this.currentStatus);
  }

  // loadShifts(): void {
  //   this._ShiftService.viewAllShifts().subscribe({
  //     next: (response) => {
  //       if (response) {
  //         console.log(response);
  //         this.shifts = response.data; 
  //         this.filteredShifts = this.shifts
        
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //     }
  //   });
  // }
  

  loadShifts(status: string): void {
    this.currentStatus = status;
    this._ShiftService.getShiftByStatus(status).subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.shifts = response.data; 
          this.filteredShifts = this.shifts
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  // loadShifts(){
  //   this._ShiftService.getShiftByStatus('open').subscribe({
  //     next: (response) => {
  //             if (response) {
  //               console.log(response);
  //               this.shifts = response.data; 
  //               this.filteredShifts = this.shifts
              
  //             }
  //           },
  //           error: (err) => {
  //             console.error(err);
  //           }
  //         });
    
  // }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredShifts = this.shifts.filter(shift =>
      (shift.user?.name?.toLowerCase().includes(query) || 
      shift.opening_amount?.toString().toLowerCase().includes(query) || 
      shift.shift?.toLowerCase().includes(query) )
      // shift.machine?.machine_number?.toString().toLowerCase().includes(query)) 
    );
  }
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCities = this.users.filter(city =>
  //     city.city.toLowerCase().includes(query) || city.country.toLowerCase().includes(query)
  //   );
  // }

  deleteShift(shiftId: number): void {
    if (confirm('هل أنت متأكد أنك تريد حذف هذه الوردية؟')) { // "Are you sure you want to delete this Shift?"
      this._ShiftService.deleteShift(shiftId).subscribe({
        next: (response) => {
          if (response) {
            this.toastr.success("تم حذف الوردية بنجاح") // "Delete Shift Successfully"
            this.router.navigate(['/dashboard/shifts']);
            this.loadShifts(this.currentStatus);
          }
        },
        error: (err) => {
          console.error(err);
          alert('حدث خطأ أثناء حذف الوردية.'); // "An error occurred while deleting the Shift."
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
  changeStatus(shiftId: number): void {
    if (confirm('هل أنت متأكد أنك تريد الموافقة على هذه الوردية؟')) {
      this._ShiftService.approveStatus(shiftId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/shifts']);
            this.loadShifts(this.currentStatus);
            this.toastr.success("تم الموافقة على هذه الوردية بنجاح")
          }
        },
        error: (err) => {
          console.error(err);
          alert('حدث خطأ أثناء الموافقة على الوردية.');
        }
      });
    }
  }

  
}