import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { SettingsService } from '../../shared/services/settings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  setting: any;
  logo: any;
  constructor(private _UserService: UserService, private router: Router,private _SettingsService:SettingsService) {}
 ngOnInit(): void {
     this.fetchSettingData()
 }
  logout(): void {
    this._UserService.logout();
  
    localStorage.removeItem('userRole');
    localStorage.removeItem('Gtoken');
    this.router.navigate(['/login']);
  }
  fetchSettingData(): void {
    this._SettingsService.getSettings().subscribe({
      next: (response) => {
        console.log("setting",response);
        this.setting = response.data|| {};
        this.logo=response.data.logo
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Sales data:', err.message);
      }
    });
  }
  
}
