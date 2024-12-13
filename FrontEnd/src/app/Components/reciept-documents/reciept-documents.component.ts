import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentDocumentService } from '../../shared/services/payment-document.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reciept-documents',
  imports: [CommonModule ],
  templateUrl: './reciept-documents.component.html',
  styleUrl: './reciept-documents.component.css'
})
export class RecieptDocumentsComponent implements OnInit {
  isLoading = false;
  accounts: any;
  compony_accounts: any;
  notes: any;
  currencies: any;

  delegates: any;
  creators: any;
  parent_accounts: any;

  documents: any[] = []; 
  filteredCities: any[] = []; 
  searchQuery: string = ''; 
  parent_accounts_company: any;

  type: string | null = '';
  constructor(private route: ActivatedRoute,
  
    private _PaymentDocumentService: PaymentDocumentService
    , private router: Router
  ) {

   

  }


  
  
  ngOnInit(): void {
    this.getParams();
    this.loadAllDocuments()
  }

  
  
  getParams() {
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
    });
    console.log(this.type);

  }


  loadAllDocuments(): void {
    this._PaymentDocumentService.viewAllDocuments().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.documents = response.data; 
        
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
 

  deleteDocument(documentId: number): void {
    if (confirm('Are you sure you want to delete this Document?')) {
      this._PaymentDocumentService.deleteDocument(documentId).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigate([`/dashboard/document/${this.type}`]);
            this.loadAllDocuments();
          }
        },
        error: (err) => {
          console.error(err);
          alert('An error occurred while deleting the User.');
        }
      });
    }
  }
}
