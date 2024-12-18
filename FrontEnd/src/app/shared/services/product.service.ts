import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
 
  viewAllProducts(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/products`,{ headers })
  }
  deleteProduct(productId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/products/${productId}`, { headers })
  }
  addProduct(userData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/products`, userData ,{ headers })
  } 
  getProductById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/products/"+id, { headers })
   
  }
  updateProduct(productId: string, productData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    productData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/products/${productId}`, productData, { headers })
  }
}
