import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  private baseURL = environment.apiUrl;
  constructor(private _HttpClient: HttpClient) { 
  }
 
  viewAllMachines(): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.get(`${this.baseURL}/machines`,{ headers })
  }
  deleteMachine(machineId: number): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.delete(`${this.baseURL}/machines/${machineId}`, { headers })
  }
  addMachine(machineData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this._HttpClient.post(`${this.baseURL}/machines`, machineData ,{ headers })
  } 
  getMachineById(id:any): Observable<any>{
    const token = localStorage.getItem('Gtoken');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this._HttpClient.get(this.baseURL+"/machines/"+id, { headers })
   
  }
  updateMachine(machineId: string, machineData: FormData): Observable<any> {
    const token = localStorage.getItem('Gtoken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    machineData.append('_method', 'PUT');
    return this._HttpClient.post(`${this.baseURL}/machines/${machineId}`, machineData, { headers })
  }
}
