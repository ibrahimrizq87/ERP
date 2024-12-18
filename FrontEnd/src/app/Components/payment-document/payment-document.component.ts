import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  constructor (private route: ActivatedRoute , private _DocumentService:DocumentService ){}
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
  
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }


  onType(type: string | null): void {
    this.type = type;
    this.getPaymentDocuments();
    
      }
}
