import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ReportsService } from '../../shared/services/reports.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test2',
  imports: [CommonModule],
  templateUrl: './test2.component.html',
  styleUrl: './test2.component.css'
})
export class Test2Component implements OnInit{
  report: any[] = []; 
  id18: number = 0;
  id19: number = 0;
  id18And19Sum: number = 0;
  id20: number = 0;
  id21: number = 0;
  id22: number = 0;
  id23: number = 0;
  main_activities:number=0;
  id24: number = 0;
  net_income:number=0;
  id25:number=0;
  final_net_income:number=0;
  currentYear: number = 0;
  constructor(
  
    private _ReportsService:ReportsService
    , private router: Router,
    private toastr :ToastrService
  ) {}
 
  ngOnInit(): void {
 
    this.loadAllequationHistory()
    this.getCurrentYear()
  }
  getCurrentYear(): void {
    const now = new Date();
    this.currentYear = now.getFullYear();
  }
  loadAllequationHistory(): void {
    this._ReportsService.yearReport().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.report = response.data; 
          const item1 = this.report.find((item) => item.id === '18');
          this.id18 = item1 ? item1.value :0;

          const item2 = this.report.find((item) => item.id === '19');
          this.id19 = item2 ? item2.value :0;

          this.id18And19Sum = this.id18 + this.id19;

          const item3 = this.report.find((item) => item.id === '20');
          this.id20 = item3 ? item3.value :0;

          const item4 = this.report.find((item) => item.id === '21');
          this.id21 = item4 ? item4.value :0;

          const item5 = this.report.find((item) => item.id === '22');
          this.id22 = item5 ? item5.value :0;

          const item6 = this.report.find((item) => item.id === '23');
          this.id23 = item6 ? item6.value :0;

          this.main_activities=this.id20+this.id21+this.id22+this.id23;

          const item7 = this.report.find((item) => item.id === '24');
          this.id24 = item7 ? item7.value :0;

          this.net_income=this.main_activities+this.id24

          const item8 = this.report.find((item) => item.id === '25');
          this.id25 = item8 ? item8.value :0;

          this.final_net_income=this.net_income+this.id25
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

        pdf.save('قائمة_ الدخل _العام.pdf');
      });
    }
  }
}
