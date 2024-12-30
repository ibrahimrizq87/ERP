import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-expenses-invoices',
  imports: [CommonModule, RouterModule],
  templateUrl: './show-expenses-invoices.component.html',
  styleUrl: './show-expenses-invoices.component.css'
})
export class ShowExpensesInvoicesComponent implements OnInit {

  expensesData: any;

  constructor(
    private _InvoiceService:InvoiceService ,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const expensesId = this.route.snapshot.paramMap.get('id');
    if (expensesId) {
      this.fetchExpensesData(expensesId);
    }
  }
  get totalAfterTax(): number {
    const totalCash = parseFloat(this.expensesData?.total_cash || '0');
    const taxAmount = parseFloat(this.expensesData?.tax_amount || '0');
    return totalCash - taxAmount;
  }
 
  fetchExpensesData (expensesId: string): void {
    this._InvoiceService.getExpensesById(expensesId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.expensesData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Expenses data:', err.message);
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

        pdf.save('Expense_Invoice.pdf');
      });
    }
  }
}
