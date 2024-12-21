import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-document',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterModule ],
  templateUrl: './payment-document.component.html',
  styleUrl: './payment-document.component.css'
})
export class PaymentDocumentComponent {

  type:string|null = null;
documents:any;
filteredDocuments: any[] = [];
searchQuery: string = ''; 
  constructor (private route: ActivatedRoute , private _DocumentService:DocumentService, private router: Router ){}
  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.type = params.get('type'); 
      this.onType(this.type); 
    });

    this.getPaymentDocuments(); 
    
  }
  getPaymentDocuments(){
    this._DocumentService.getAllByType(this.type||'').subscribe({
      next: (response) => {
        if (response) {
          this.documents = response.data; 
          console.log(this.documents);
          this.filteredDocuments = [...this.documents];
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredDocuments = this.documents.filter((document: { receiver_name: string; amount: { toString: () => string; }; type: string; customer_account: { account_name: string; }; company_account: { account_name: string; }; }) =>
      document.receiver_name.toLowerCase().includes(query) ||
      document.amount.toString().toLowerCase().includes(query) ||
      document.type.toLowerCase().includes(query) ||
      document.customer_account.account_name.toLowerCase().includes(query) ||
      document.company_account.account_name.toLowerCase().includes(query)
    );
  }

  onType(type: string | null): void {
    this.type = type;
    this.getPaymentDocuments();
    
      }
      deleteDocument(documentId: number): void {
        if (confirm('Are you sure you want to delete this Document?')) {
          this._DocumentService.deleteDocument(documentId).subscribe({
            next: (response) => {
              if (response) {
                this.router.navigate([`/dashboard/paymentDocument/${this.type}`]);
                this.getPaymentDocuments();
              }
            },
            error: (err) => {
              console.error(err);
              alert('An error occurred while deleting the Document.');
            }
          });
        }
      }
}
