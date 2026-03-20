import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';
import { ApiResponse } from '../service/response/ApiResponse';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private api = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<any> {
    return this.http.get<any>(this.api);
  }
}
