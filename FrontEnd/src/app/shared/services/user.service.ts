import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
  private checkToken(): boolean {
    return !!localStorage.getItem('Gtoken');
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
  logout(): void {
    const token = localStorage.getItem('Gtoken');

    if (!token) {
      console.error('No access token found.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this._HttpClient.post(`${this.baseURL}/logout`, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
        // localStorage.removeItem('eToken');
        localStorage.removeItem('Gtoken');
        localStorage.removeItem('userRole');
        // localStorage.removeItem('pusherTransportTLS');
        // this.userRole = null;
        this.isAuthenticatedSubject.next(false); // Emit false on logout
        //this._Router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }
}
