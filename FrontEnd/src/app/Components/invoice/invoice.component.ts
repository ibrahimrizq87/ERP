import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { SalesService } from '../../shared/services/sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../shared/services/settings.service';
import * as QRCode from 'qrcode';
import { AccountingService } from '../../shared/services/accounts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit {
  currentTime: string = '';
  salesData: any;
  setting:any;
  constructor(private _AccountingService:AccountingService,
    private _SalesService:SalesService ,
    private _SettingsService:SettingsService ,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  taxRate: any;

  ngOnInit(): void {
    this.getTaxRate();

    const salesId = this.route.snapshot.paramMap.get('id');
    if (salesId) {
      this.fetchInvoiceData(salesId);
    }
    this.fetchSettingData();
    this.setCurrentTime();
  }

  getTaxRate(): void {
    this._AccountingService.getTaxRate().subscribe({
      next: (response) => {
        if (response) {
          this.taxRate = parseFloat(response.rate); 
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getType(type:string){
    if(type == 'debit'){
      return 'اجل';
    }else{
      return 'كاش';
    }
  }

  setCurrentTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleString(); 
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
  
  fetchInvoiceData(equationId: string): void {
    this._SalesService.getSalesInvoice(equationId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.salesData = response.data|| {};
        this.generateQRCode(); 
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Sales data:', err.message);
      }
    });
  }
  
  // generateQRCode(): void {
  //   const qrCanvas: HTMLCanvasElement | null = document.getElementById('invoice-qr') as HTMLCanvasElement;
  //   if (!qrCanvas) return;

  //   const invoiceData = {
  //     customerName: this.salesData?.customerName || '',
  //     customerTaxId: this.salesData?.customerTaxId || '',
  //     customerPhone: this.salesData?.customerPhone || '',
  //     invoiceNumber: this.salesData?.invoiceNumber || '',
  //     total: this.salesData?.total || '',
  //     date: this.salesData?.date || ''
  //   };

  //   const qrData = JSON.stringify(invoiceData); // Encode invoice details as a JSON string
  //   QRCode.toCanvas(qrCanvas, qrData, { width: 150 }, (error) => {
  //     if (error) {
  //       console.error('Error generating QR code:', error);
  //     }
  //   });
  // }
  generateQRCode(): void {
    const qrCanvas: HTMLCanvasElement | null = document.getElementById('invoice-qr') as HTMLCanvasElement;
    if (!qrCanvas) return;
  
    // URL that opens the invoice
    const salesId = this.route.snapshot.paramMap.get('id');
    const qrData = `سعر الفاتورة: ${this.salesData.amount}`;
  
    QRCode.toCanvas(qrCanvas, qrData, { width: 150 }, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
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

        pdf.save('invoice.pdf');
      });
    }
  }
}
