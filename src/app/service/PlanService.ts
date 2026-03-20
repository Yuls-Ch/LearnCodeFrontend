import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plan } from '../models/Plan';
import { Subscription } from '../models/Subscription';
import { ApiResponse } from '../service/response/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private API = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<ApiResponse<Plan[]>> {
  return this.http.get<ApiResponse<Plan[]>>(`${this.API}/plans`);
}

  // Traer mi suscripción actual
  getMySubscription(): Observable<ApiResponse<Subscription>> {
    return this.http.get<ApiResponse<Subscription>>(`${this.API}/subscription/me`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('google_token'),
      },
    });
  }
}
