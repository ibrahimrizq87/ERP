import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  msgError: any[] = [];
  totalBalance19: number = 0;
  totalBalance20: number = 0;
  totalBalance22: number = 0;
  totalBalance23: number = 0;

  isLoading = false;
  accounts19: any[] = []; 
  accounts20: any[] = []; 
  accounts22: any[] = [];
  accounts23: any[] = []; 

  currentYear: number = 0;
 


  constructor(
  
    private _ReportsService:ReportsService
    , private router: Router,
    private toastr :ToastrService
  ) {}
 
  ngOnInit(): void {
  this.getAccountsByType19();
  this.getAccountsByType20();
  this.getAccountsByType22();
  this.getAccountsByType23();
  this.getCurrentYear(); 
  }
  getCurrentYear(): void {
    const now = new Date();
    this.currentYear = now.getFullYear();
  }
 
  getAccountsByType19(): void {
    this._ReportsService.getAccountsByType("19").subscribe({
      next: (response) => {
        if (response) {
          this.accounts19 = response.data;
          console.log(response.data);
          this.totalBalance19 = this.accounts19.reduce(
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
  getAccountsByType20(): void {
    this._ReportsService.getAccountsByType("20").subscribe({
      next: (response) => {
        if (response) {
          this.accounts20 = response.data;
          console.log(response.data);
          this.totalBalance20 = this.accounts20.reduce(
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
  getAccountsByType22(): void {
    this._ReportsService.getAccountsByType("22").subscribe({
      next: (response) => {
        if (response) {
          this.accounts22 = response.data;
          console.log(response.data);
          this.totalBalance22 = this.accounts22.reduce(
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
  getAccountsByType23(): void {
    this._ReportsService.getAccountsByType("23").subscribe({
      next: (response) => {
        if (response) {
          this.accounts23 = response.data;
          console.log(response.data);
          this.totalBalance23 = this.accounts23.reduce(
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

        pdf.save('test.pdf');
      });
    }
  }
}  