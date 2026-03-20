import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseModule } from '../../../service/AdminContentService'; // Reutilizamos interfaces


@Injectable({ providedIn: 'root' })
export class ClientContentService {
  private apiUrl = 'http://localhost:8080/api/client/content';
  private adminApiUrl = 'http://localhost:8080/api/admin/content'; // Para descargar el archivo usamos el mismo endpoint público

  constructor(private http: HttpClient) {}

  getModules(courseId: string): Observable<CourseModule[]> {
    return this.http.get<CourseModule[]>(`${this.apiUrl}/course/${courseId}`);
  }

  getProgress(courseId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/course/${courseId}/progress`);
  }

  markAsCompleted(moduleId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/module/${moduleId}/complete`, {});
  }

 getFileContent(fileId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/file/${fileId}`); 
}
}