// src/app/services/subscription.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from '../models/Subscription';

interface ApiResponse<T> {
  success: boolean;
  mensaje: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private api = 'http://localhost:8080/api/subscription';

  constructor(private http: HttpClient) {}

  getMySubscription() {
    return this.http.get<ApiResponse<Subscription>>(`${this.api}/me`);
  }

  cancelMySubscription() {
    return this.http.post<ApiResponse<void>>(
      `${this.api}/cancel`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('google_token'),
        },
      },
    );
  }
}
