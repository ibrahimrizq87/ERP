import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
 
  viewAllPurchaseInvoices(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/purchase_invoices`,{ headers })
  }
  deletePurchaseInvoice(invoiceId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/purchase_invoices/${invoiceId}`, { headers })
  }
  addPurchaseInvoice(invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/purchase_invoices`, invoiceData ,{ headers })
  } 
  getPurchaseInvoiceById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/purchase_invoices/"+id, { headers })
   
  }
  updatePurchaseInvoice(invoiceId: string, invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    invoiceData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/purchase_invoices/${invoiceId}`, invoiceData, { headers })
  }
  viewAllExpenses(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/expense_invoices`,{ headers })
  }
  deleteExpenses(invoiceId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/expense_invoices/${invoiceId}`, { headers })
  }
  addExpenses(invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/expense_invoices`, invoiceData ,{ headers })
  } 
  getExpensesById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/expense_invoices/"+id, { headers })
   
  }
  updateExpenses(invoiceId: string, invoiceData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    invoiceData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/expense_invoices/${invoiceId}`, invoiceData, { headers })
  }
}
