import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../shared/services/settings.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-test3',
  imports: [CommonModule],
  templateUrl: './test3.component.html',
  styleUrl: './test3.component.css'
})
export class Test3Component implements OnInit {
  msgError: any[] = [];
  totalBalance1: number = 0;
  totalBalance7: number = 0;
  totalBalance5: number = 0;

  isLoading = false;
  accounts1: any[] = []; 
  accounts7: any[] = []; 
  accounts5: any[] = []; 

  currentYear: number = 0;
  setting: any;
 


  constructor(
  
    private _ReportsService:ReportsService
    , private _SettingsService: SettingsService,
    
  ) {}
 
  ngOnInit(): void {
  this.getAccountsByType1();
  this.getAccountsByType7();
  this.getAccountsByType5();
  this.getCurrentYear(); 
  this.fetchSettingData();
  }
  getCurrentYear(): void {
    const now = new Date();
    this.currentYear = now.getFullYear();
  }
 
  getAccountsByType1(): void {
    this._ReportsService.getAccountsByType("1").subscribe({
      next: (response) => {
        if (response) {
          this.accounts1 = response.data;
          console.log(response.data);
          this.totalBalance1 = this.accounts1.reduce(
            (total, account) => total + parseFloat(account.current_balance || 0),
            0
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  fetchSettingData(): void {
    this._SettingsService.getSettings().subscribe({
      next: (response) => {
        console.log("setting",response);
        this.setting = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Sales data:', err.message);
      }
    });
  }
  getAccountsByType7(): void {
    this._ReportsService.getAccountsByType("7").subscribe({
      next: (response) => {
        if (response) {
          this.accounts7 = response.data;
          console.log(response.data);
          this.totalBalance7 = this.accounts7.reduce(
            (total, account) => total + parseFloat(account.current_balance || 0),
            0
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getAccountsByType5(): void {
    this._ReportsService.getAccountsByType("5").subscribe({
      next: (response) => {
        if (response) {
          this.accounts5 = response.data;
          console.log(response.data);
          this.totalBalance5 = this.accounts5.reduce(
            (total, account) => total + parseFloat(account.current_balance || 0),
            0
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  exportToPDF(): void {
    const content: HTMLElement | null = document.getElementById('invoice-details');
    if (content) {
      html2canvas(content).then((canvas: { toDataURL: (arg0: string) => any; height: number; width: number; }) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190; 
        const pageHeight = 297; 
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('إيضاحات_ قائمة _المركز _المالي.pdf');
      });
    }
  }
}
