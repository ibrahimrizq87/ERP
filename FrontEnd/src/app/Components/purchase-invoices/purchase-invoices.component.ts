import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-invoices',
  imports: [CommonModule,RouterModule,FormsModule],
  templateUrl: './purchase-invoices.component.html',
  styleUrl: './purchase-invoices.component.css'
})
export class PurchaseInvoicesComponent implements OnInit {
  isLoading = false;
  purchases: any[] = []; 
  filteredPurchases: any[] = [];
  searchQuery: string = '';
  constructor(
  
    private _InvoiceService: InvoiceService
    , private router: Router
  ) {}
  ngOnInit(): void {
 
    this.loadAllPurchases()
  }
  loadAllPurchases(): void {
    this._InvoiceService.viewAllPurchaseInvoices().subscribe({
      next: (response) => {
        if (response) {
          console.log(response.data);
          this.purchases = response.data; 
          this.filteredPurchases = this.purchases;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  filterPurchases(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredPurchases = this.purchases.filter(purchase => 
      purchase.date.toLowerCase().includes(query) || 
      purchase.payment_type.toLowerCase().includes(query)
    );
  }


  deletePurchase(purchaseId: number): void {
    if (confirm('Are you sure you want to delete this Purchase?')) {
      this._InvoiceService.deletePurchaseInvoice(purchaseId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/purchaseInvoices`]);
            this.loadAllPurchases();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the Purchase.');
        }
      });
    }
  }
}
