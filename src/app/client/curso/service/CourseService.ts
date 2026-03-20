import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCourse } from '../../../models/ClientCourseDto';
import { ApiResponse } from '../../../service/response/ApiResponse';

@Injectable({
  providedIn: 'root'
})
export class ClientCourseService {

  private apiUrl = 'http://localhost:8080/api/courses';

  constructor(private http: HttpClient) { }

  list(title?: string): Observable<ApiResponse<ClientCourse[]>> {
    let params = new HttpParams();

    if (title) {
      params = params.set('title', title);
    }
    
    console.log("URL:", this.apiUrl);
        return this.http.get<ApiResponse<ClientCourse[]>>(this.apiUrl, { params });
  }

  getById(id: string): Observable<ApiResponse<ClientCourse>> {
    return this.http.get<ApiResponse<ClientCourse>>(`${this.apiUrl}/${id}`);
  }
}
