import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainReportsService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }



  getSalesInvoicesReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams({ fromObject: filters });

    return this._HttpClient.get(this.baseURL+"/reports/sales-invoice-reports", { headers })
   
  }

 
  //   getProductReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any>{
  //   const token = localStorage.getItem('Gtoken');

  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   const params = new HttpParams({ fromObject: filters });

  //   return this._HttpClient.get(this.baseURL+"/reports/product-reports", { headers })
   
  // }
  
  getProductReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams({ fromObject: filters });
    console.log('Filters sent to API:', filters); // Debugging
    return this._HttpClient.get(this.baseURL + "/reports/product-reports", { headers, params });
}


  getShiftReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams({ fromObject: filters });

    return this._HttpClient.get(this.baseURL+"/reports/shifts-reports", { headers })
   
  }

  getPurchaseInvoicesReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams({ fromObject: filters });

    return this._HttpClient.get(this.baseURL+"/reports/purchase-invoice-reports", { headers })
   
  }
  getExpencesInvoicesReports(filters: { startDate?: string; endDate?: string; today?: boolean; thisYear?: boolean }): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams({ fromObject: filters });

    return this._HttpClient.get(this.baseURL+"/reports/expense-invoice-reports", { headers })
   
  }
  
}
