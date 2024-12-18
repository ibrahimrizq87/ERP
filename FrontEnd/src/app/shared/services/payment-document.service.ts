import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentDocumentService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
  viewAllDocuments(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/documents`,{ headers })
  }
  deleteDocument(id: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/documents/${id}`, { headers })
  }
  addDocument(documentData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/documents`, documentData ,{ headers })
  }
  getDocumentById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/documents/"+id, { headers })
   
  }
  updateDocument(documentId: string, documentData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    documentData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/documents/${documentId}`, documentData, { headers })
  } 
}
