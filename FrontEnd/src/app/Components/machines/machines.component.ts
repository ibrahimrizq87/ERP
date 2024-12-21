import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MachineService } from '../../shared/services/machine.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-machines',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit {

  machines: any[] = []; 
  filteredMachines: any[] = []; 
  searchQuery: string = ''; 

  constructor(private _MachineService: MachineService, private router: Router, private cdr: ChangeDetectorRef,private toastr:ToastrService) {}


  ngOnInit(): void {
    this.loadMachines(); 
  }

  loadMachines(): void {
    this._MachineService.viewAllMachines().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.machines = response.data; 
          this.filteredMachines = this.machines;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredMachines = this.machines.filter(machine =>
      machine.product?.name.toLowerCase().includes(query) || 
      // machine.price.toString().includes(query) || 
      machine.machine_number.toString().includes(query)
    );
  }
  // onSearch(): void {
  //   const query = this.searchQuery.toLowerCase();
  //   this.filteredCities = this.users.filter(city =>
  //     city.city.toLowerCase().includes(query) || city.country.toLowerCase().includes(query)
  //   );
  // }

  deleteMachine(machineId: number): void {
    if (confirm('Are you sure you want to delete this Machine?')) {
      this._MachineService.deleteMachine(machineId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/machines']);
            this.toastr.error("Delete Machine Successfully")
            // this.loadMachines();
            this.loadMachines()
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the Machine.');
        }
      });
    }
  }
}
