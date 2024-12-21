import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../shared/services/document.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show-document',
  imports: [CommonModule,RouterModule],
  templateUrl: './show-document.component.html',
  styleUrl: './show-document.component.css'
})
export class ShowDocumentComponent implements OnInit {

  documentData: any;
  type: string | null = null;
  constructor(
    private _DocumentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const type = this.route.snapshot.paramMap.get('type');
    console.log(type) 
    this.type = type;
    if (id) {
      this.fetchDocumentData(id);
    }
  }

 
  fetchDocumentData(documentId: string): void {
    this._DocumentService.getDocumentById(documentId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.documentData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching Document data:', err.message);
      }
    });
  }
  
}
