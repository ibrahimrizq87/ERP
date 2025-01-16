import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
 
  viewAllShifts(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/shifts`,{ headers })
  }


  
  
  deleteClientPay(item_id: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/shifts/delete-online-client/${item_id}`, { headers })
  }
  deleteOnlinePay(item_id: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/shifts/delete-online-payment/${item_id}`, { headers })
  }
  deleteShift(shiftId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/shifts/${shiftId}`, { headers })
  }
  addShift(shiftData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/shifts`, shiftData ,{ headers })
  } 
  getShiftById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/shifts/"+id, { headers })
   
  }
  updateShift(shiftId: string, shiftData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    shiftData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/shifts/${shiftId}`, shiftData, { headers })
  }
  closeShift(shiftId: string, shiftData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    shiftData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/shifts/closeShift/${shiftId}`, shiftData, { headers })
  }
  approveStatus(shift_Id:number){
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/shifts/approve/${shift_Id}`, { headers })
   }
   getShiftByStatus(status:string): Observable<any>{
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
 
    return this._HttpClient.get(`${this.baseURL}/shifts/by-status/${status}`, { headers })

  }

}
