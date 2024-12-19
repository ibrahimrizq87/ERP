import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private _UserService: UserService, private router: Router) {}
  logout(): void {
    
    this._UserService.logout();
   

    this.router.navigate(['/login']);
  
  }
}
