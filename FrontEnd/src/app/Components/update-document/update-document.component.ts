import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../../shared/services/document.service';
import { UserService } from '../../shared/services/user.service';
import { AccountingService } from '../../shared/services/accounts.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-document',
  imports: [CommonModule ,ReactiveFormsModule ],
  templateUrl: './update-document.component.html',
  styleUrl: './update-document.component.css'
})
export class UpdateDocumentComponent implements OnInit {
  users:any[]=[];
  transactionForm: FormGroup;
  documentImageUrl: string | null = null;
  companyAccounts:any[]=[];
  customerAccounts:any[]=[];
  isLoading = false;
  type: any;  
  msgError: any;
  readonly maxImageSize = 2048 * 1024;
  constructor(private fb: FormBuilder, private route: ActivatedRoute,private _DocumentService:DocumentService,private _Router:Router,private _UserService:UserService,private _AccountingService:AccountingService,private toastr :ToastrService) {
    this.transactionForm = this.fb.group({
      user_id: [null, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
     
      receiver_name: ['', [Validators.required, Validators.maxLength(255)]],
      company_account_id: ['', [Validators.required]],
      customer_account_id: ['', [Validators.required]],
      image: [null,[this.validateImage.bind(this)]],
    });
  }
  selectedFile: File | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.transactionForm.patchValue({ image: file });
    }
  }
  validateImage(control: AbstractControl): ValidationErrors | null {
    const file = this.selectedFile;
    if (file) {
      const fileType = file.type;
      const fileSize = file.size;
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }
      if (fileSize > this.maxImageSize) {
        return { fileTooLarge: true };
      }
    }
    return null;
  }
  ngOnInit(): void {
    // Retrieve the 'type' parameter from the URL
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type')!;
      console.log('Received type:', this.type);  // Logs 'recipt' or 'payment' based on URL
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchDocumentData(id);
    }
    this.loadUsers();
    this.getCustomerAccounts();
    this.getCompanyAccounts();
  }
  fetchDocumentData(id: string): void {
    this._DocumentService.getDocumentById(id).subscribe({
      next: (response) => {
        if (response) {
          const documentData = response.data ; 
          console.log(documentData)
          this.transactionForm.patchValue({
            user_id:documentData.user_id,
            amount:documentData.amount,
            receiver_name:documentData.receiver_name,
            company_account_id:documentData.company_account_id,
            customer_account_id:documentData.customer_account_id,
            // image:documentData.image,
              
          });
          this.documentImageUrl = documentData.image;
       
        }
      },
      error: (err: HttpErrorResponse) => {
        this.msgError = err.error.error;
      }
    });
  }
  loadUsers(): void {
    this._UserService.viewAllUsers().subscribe({
      next: (response) => {
        if (response) {
          console.log(response);
          this.users = response.data; 
          // this.filteredCities = this.users;
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
  getCustomerAccounts(){
    this._AccountingService.viewAllCustomerAccounts().subscribe({
     next: (response) => {
       if (response) {
         this.customerAccounts = response.data; 
         console.log(this.customerAccounts);
 
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }
   getCompanyAccounts(){
    this._AccountingService.viewAllCompanyAccounts().subscribe({
     next: (response) => {
       if (response) {
         this.companyAccounts = response.data; 
         console.log(this.companyAccounts);
 
       }
     },
     error: (err) => {
       console.error(err);
     }
   });
 
   }
 
  handleForm() {
   
    if (this.transactionForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

    
      formData.append('amount', this.transactionForm.get('amount')?.value);
  
      
      formData.append('type', this.type);
      formData.append('user_id', this.transactionForm.get('user_id')?.value);
      formData.append('receiver_name', this.transactionForm.get('receiver_name')?.value);
      formData.append('type', this.type);
      formData.append('company_account_id', this.transactionForm.get('company_account_id')?.value);
      formData.append('customer_account_id', this.transactionForm.get('customer_account_id')?.value);
      if (this.selectedFile) {
        formData.append('image',this.transactionForm.get('image')?.value);
        console.log(this.selectedFile)
      }
      const documentId = this.route.snapshot.paramMap.get('id');
      console.log(documentId)
      if (documentId){
      this._DocumentService.updateDocument(documentId,formData).subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            this.isLoading = false;
            this.toastr.success("تم تحديث مستند الدفع بنجاح");
            this._Router.navigate([`/dashboard/paymentDocument/${this.type}`]);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          this.msgError = [];
      
          if (err.error && err.error.errors) {
             
              for (const key in err.error.errors) {
                  if (err.error.errors[key] instanceof Array) {
                      this.msgError.push(...err.error.errors[key]);
                  } else {
                      this.msgError.push(err.error.errors[key]);
                  }
              }
          }
      
          console.error(this.msgError);
          this.toastr.error('حدث خطأ، يرجى المحاولة مرة أخرى'); 
      },
      });
    }
    }
  }
  onCancel(): void {
    this.transactionForm.reset();
    this._Router.navigate([`/dashboard/paymentDocument/${this.type}`]);
  }  
}

