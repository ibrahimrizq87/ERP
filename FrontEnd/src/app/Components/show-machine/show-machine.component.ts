import { Component, OnInit } from '@angular/core';
import { MachineService } from '../../shared/services/machine.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-machine',
  imports: [RouterModule],
  templateUrl: './show-machine.component.html',
  styleUrl: './show-machine.component.css'
})
export class ShowMachineComponent implements OnInit {

  machineData: any;

  constructor(
    private _MachineService: MachineService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const machineId = this.route.snapshot.paramMap.get('id');
    if (machineId) {
      this.fetchMachineData(machineId);
    }
  }

 
  fetchMachineData(machineId: string): void {
    this._MachineService.getMachineById(machineId).subscribe({
      next: (response) => {
        console.log(response);
        this.machineData = response|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Product data:', err.message);
      }
    });
  }
  
}