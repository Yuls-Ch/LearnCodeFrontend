import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from './response/ApiResponse';

// Asegúrate de tener estas interfaces exportadas o impórtalas de tus modelos
export interface CourseModule {
  id?: string;
  courseId: string;
  title: string;
  moduleOrder: number;
  files?: any[];
}

export interface CreateFileDTO {
  moduleId: string;
  fileName: string;
  mimeType: string;
  base64: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminContentService {
  
  private apiUrl = 'http://localhost:8080/api/admin/content';

  constructor(private http: HttpClient) {}

  // 1. Obtener estructura
  getModulesByCourse(courseId: string): Observable<any[]> {
    return this.http.get<ApiResponse<any[]>>(`${this.apiUrl}/course/${courseId}`)
      .pipe(map(res => res.data));
  }

  // 2. Crear Módulo
  createModule(courseId: string, title: string, order: number): Observable<CourseModule> {
    const body = { courseId, title, order };
    return this.http.post<ApiResponse<CourseModule>>(`${this.apiUrl}/module`, body)
      .pipe(map(res => res.data));
  }

  // 3. Eliminar Módulo
  deleteModule(moduleId: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/module/${moduleId}`)
      .pipe(map(res => res.data));
  }

  // 4. Subir Archivo
  uploadFile(dto: CreateFileDTO): Observable<string> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/file`, dto)
      .pipe(map(res => res.data));
  }

  // 5. Descargar/Ver Archivo
  getFileContent(fileId: string): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/file/${fileId}`)
      .pipe(map(res => res.data));
  }

  // 6. Actualizar Módulo
  updateModule(moduleId: string, title: string): Observable<CourseModule> {
    const body = { title };
    return this.http.put<ApiResponse<CourseModule>>(`${this.apiUrl}/module/${moduleId}`, body)
      .pipe(map(res => res.data));
  }

  // 7. Eliminar Archivo
  deleteFile(fileId: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(`${this.apiUrl}/file/${fileId}`)
      .pipe(map(res => res.data));
  }
}