import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminCourseDto } from '../models/AdminCourseDto';
import { ApiResponse } from './response/ApiResponse';
import { PageResponse } from './response/PageResponse';

@Injectable({ providedIn: 'root' })
export class AdminCourseService {

  private readonly endpoint = 'http://localhost:8080/api/admin/courses';

  constructor(private readonly http: HttpClient) { }
  
  getAll(): Observable<ApiResponse<AdminCourseDto[]>> {
    return this.http.get<ApiResponse<AdminCourseDto[]>>(this.endpoint);
  }

  create(course: AdminCourseDto): Observable<ApiResponse<AdminCourseDto>> {
    return this.http.post<ApiResponse<AdminCourseDto>>(this.endpoint, course);
  }

  getById(id: string): Observable<ApiResponse<AdminCourseDto>> {
    return this.http.get<ApiResponse<AdminCourseDto>>(`${this.endpoint}/${id}`);
  }

  update(id: string, course: AdminCourseDto): Observable<ApiResponse<AdminCourseDto>> {
    return this.http.put<ApiResponse<AdminCourseDto>>(`${this.endpoint}/${id}`, course);
  }

  delete(id: string): Observable<ApiResponse<AdminCourseDto>> {
    return this.http.delete<ApiResponse<AdminCourseDto>>(`${this.endpoint}/${id}`);
  }

  getPaged(page: number, size: number, title?: string, published?: string): Observable<ApiResponse<PageResponse<AdminCourseDto>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (title && title.trim() !== '') {
      params = params.set('title', title);
    }

    if (published && published !== 'ALL') {
      params = params.set('published', published);
    }

    return this.http.get<ApiResponse<PageResponse<AdminCourseDto>>>(`${this.endpoint}/paged`,{ params });
  }
}
