import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = 'dq3ut13kr';
  private uploadPreset = 'curso_icons';

  constructor(private http: HttpClient) { }

  uploadIcon(file: File): Observable<string> {

    const formData = new FormData();
    formData.append("file", file);

    return this.http.post(
      "http://localhost:8080/api/admin/upload/image",
      formData,
      { responseType: "text" }
    );
  }

}
