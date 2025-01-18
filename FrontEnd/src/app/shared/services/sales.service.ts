import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
 
  viewsalesInvoicesByShift(shift_Id:string): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/sales-invoices/by-shift/${shift_Id}`,{ headers })
  }
  deleteSalesInvoice(invoiceId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/sales-invoices/${invoiceId}`, { headers })
  }
  addSalesInvoice(invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/sales-invoices`, invoiceData ,{ headers })
  } 
  getSalesInvoice(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/sales-invoices/"+id, { headers })
   
  }
  updateSalesInvoice(invoiceId: string, invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    invoiceData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/sales-invoices/${invoiceId}`, invoiceData, { headers })
  }
  viewAllSalesInvoices(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/sales-invoices`,{ headers })
  }
}
