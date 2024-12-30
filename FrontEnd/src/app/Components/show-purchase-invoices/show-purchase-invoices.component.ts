import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoiceService } from '../../shared/services/invoice.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-show-purchase-invoices',
  imports: [RouterModule,CommonModule],
  templateUrl: './show-purchase-invoices.component.html',
  styleUrl: './show-purchase-invoices.component.css'
})
export class ShowPurchaseInvoicesComponent implements OnInit {

  purchaseData: any;

  constructor(
    private _InvoiceService:InvoiceService ,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const purchaseId = this.route.snapshot.paramMap.get('id');
    if (purchaseId) {
      this.fetchPurchaseData(purchaseId);
    }
  }
  get totalAfterTax(): number {
    const totalCash = parseFloat(this.purchaseData?.total_cash || '0');
    const taxAmount = parseFloat(this.purchaseData?.tax_amount || '0');
    return totalCash - taxAmount;
  }
 
  fetchPurchaseData (purchaseId: string): void {
    this._InvoiceService.getPurchaseInvoiceById(purchaseId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.purchaseData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Purchase data:', err.message);
      }
    });
  }

  exportToPDF(): void {
    const content: HTMLElement | null = document.getElementById('invoice-details');
    if (content) {
      html2canvas(content).then((canvas: { toDataURL: (arg0: string) => any; height: number; width: number; }) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190; // PDF page width
        const pageHeight = 297; // PDF page height
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add the first page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add more pages if necessary
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('Purchase_Invoice.pdf');
      });
    }
  }
}