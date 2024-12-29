import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InvoiceService } from '../../shared/services/invoice.service';


@Component({
  selector: 'app-show-purchase-invoices',
  imports: [RouterModule],
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
  
}