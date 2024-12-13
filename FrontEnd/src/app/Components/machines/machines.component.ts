import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../shared/services/machine.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-machines',
  imports: [CommonModule,RouterModule],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit {

  machines: any[] = []; 
  filteredCities: any[] = []; 
  searchQuery: string = ''; 

  constructor(private _MachineService: MachineService, private router: Router) {}

  ngOnInit(): void {
    this.loadMachines(); 
  }

  loadMachines(): void {
    this._MachineService.viewAllMachines().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.machines = response.data; 
        
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

  deleteMachine(machineId: number): void {
    if (confirm('Are you sure you want to delete this Machine?')) {
      this._MachineService.deleteMachine(machineId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate(['/dashboard/machines']);
            this.loadMachines();
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
