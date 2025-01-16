import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report5',
  imports: [CommonModule],
  templateUrl: './report5.component.html',
  styleUrl: './report5.component.css'
})
export class Report5Component implements OnInit {
  reportYear: any[] = []; 
  currentYear: number = 0;
  totalFirstPrice: number = 0;
  totalCurrentPrice: number = 0;
  totalNetFirstPrice: number = 0;
  totalDepreciation: number = 0;
  totalNetBookValue: number = 0;
  constructor(
  
    private _ReportsService:ReportsService
    , private router: Router,
    private toastr :ToastrService
  ) {}
  ngOnInit(): void {
    
    this.getCurrentYear(); 
    this.loadAllequationHistory()
  }

  
  loadAllequationHistory(): void {
    this._ReportsService.equationHistory().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.reportYear = response.data; 
          this.calculateTotals();
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 
    getCurrentYear(): void {
      const now = new Date();
      this.currentYear = now.getFullYear();
    }
    calculateTotals(): void {
      this.totalFirstPrice = this.reportYear.reduce(
        (sum, item) => sum + (+item.equation_id.first_price || 0),
        0
      );
      this.totalCurrentPrice = this.reportYear.reduce(
        (sum, item) => sum + (+item.equation_id.current_price || 0),
        0
      );
      this.totalNetFirstPrice = this.reportYear.reduce(
        (sum, item) => sum + (+item.equation_id.first_price || 0), 
        0
      );
      this.totalDepreciation = this.reportYear.reduce(
        (sum, item) => sum + (+item.amount || 0),
        0
      );
      this.totalNetBookValue = this.reportYear.reduce(
        (sum, item) => sum + ((+item.equation_id.first_price || 0) - (+item.amount || 0)),
        0
      );
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

        pdf.save('Year_Report.pdf');
      });
    }
  }
}

