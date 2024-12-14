import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-user',
  imports: [CommonModule,RouterLinkActive,RouterModule],
  templateUrl: './show-user.component.html',
  styleUrl: './show-user.component.css'
})
export class ShowUserComponent implements OnInit {

  userData: any;

  constructor(
    private _UserService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchUserData(userId);
    }
  }

 
  fetchUserData(userId: string): void {
    this._UserService.getUserById(userId).subscribe({
      next: (response) => {
        console.log(response.user);
        this.userData = response?.user || {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Users data:', err.message);
      }
    });
  }
  
}
