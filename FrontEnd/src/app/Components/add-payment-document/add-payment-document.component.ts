import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule,  } from '@angular/forms';

@Component({
  selector: 'app-add-payment-document',
  imports:  [CommonModule,ReactiveFormsModule],
  templateUrl: './add-payment-document.component.html',
  styleUrl: './add-payment-document.component.css'
})
export class AddPaymentDocumentComponent {


  transactionForm: FormGroup;
  companyAccounts = [
    { id: 1, name: 'Company Account A' },
    { id: 2, name: 'Company Account B' },
    { id: 3, name: 'Company Account C' },
  ];
  customerAccounts = [
    { id: 1, name: 'Customer Account X' },
    { id: 2, name: 'Customer Account Y' },
    { id: 3, name: 'Customer Account Z' },
  ];
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      amount: [
        '',
        [Validators.required, Validators.min(0)],
      ],
      type: [
        '',
        [Validators.required],
      ],
      receiver_name: [
        '',
        [Validators.required, Validators.maxLength(255)],
      ],
      company_account_id: [
        '',
        [Validators.required],
      ],
      customer_account_id: [
        '',
        [Validators.required],
      ],
      image: [null],
    });
  }

  ngOnInit(): void {
 
  }

  handleForm(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    // Perform submission logic here
    this.isLoading = true;

    const formData = new FormData();
    Object.entries(this.transactionForm.value).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });

    console.log('Form submitted:', this.transactionForm.value);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      alert('Transaction successfully created!');
    }, 2000);
  }
}
