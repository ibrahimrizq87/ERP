import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-test',
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
export class TestComponent implements OnInit {
  msgError: any[] = [];
  
 
  isLoading = false;
  equationHistory: any[] = []; 
  filteredEquations: any[] = [];
  searchQuery: string = '';
 

  constructor(
  
    private _ReportsService:ReportsService
    , private router: Router,
    private toastr :ToastrService
  ) {}
 
  ngOnInit(): void {
 
    this.loadAllequationHistory()
  }
  loadAllequationHistory(): void {
    this._ReportsService.yearReport().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.equationHistory = response.data; 
          this.filteredEquations = this.equationHistory;
        }
      },
      error: (err) => {
        console.error(err);
      }
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