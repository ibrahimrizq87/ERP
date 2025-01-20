import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../shared/services/sales.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-show-sales-invoice',
  imports: [RouterModule],
  templateUrl: './show-sales-invoice.component.html',
  styleUrl: './show-sales-invoice.component.css'
})
export class ShowSalesInvoiceComponent implements OnInit {


  salesData: any;

  constructor(
    private _SalesService:SalesService ,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const saleId = this.route.snapshot.paramMap.get('id');
    if (saleId) {
      this.fetchSalesData(saleId);
    }
  }
getPaymentType(type:string){
if(type == 'debit'){
return 'آجل';
}else{
  return 'كاش';

}
}
 
  fetchSalesData (saleId: string): void {
    this._SalesService.getSalesInvoice(saleId).subscribe({
      next: (response) => {
        console.log(response.data);
        this.salesData = response.data|| {};
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching sales data:', err.message);
      }
    });
  }

 
}