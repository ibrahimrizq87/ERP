import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
  setLogin(userData: FormData): Observable<any> {
    return this._HttpClient.post(`${this.baseURL}/login`, userData);
  }
  viewAllUsers(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/users/get-users`,{ headers })
  }
  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/users/delete-user/${userId}`, { headers })
  }
  addUser(userData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/users/add-user`, userData ,{ headers })
  } 
  getUserById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/users/get-user/"+id, { headers })
   
  }
  updateUser(userId: string, userData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    userData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/users/update-user/${userId}`, userData, { headers })
  }
}
