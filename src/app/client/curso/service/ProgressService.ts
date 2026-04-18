import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CourseProgress } from "../../../models/CourseProgressDto";
import { ApiResponse } from "../../../service/response/ApiResponse";

@Injectable({ providedIn: 'root' })
export class ProgressService {

  private apiUrl = 'http://localhost:8080/api/client';

  constructor(private http: HttpClient) { }

    getCourseProgress(): Observable<ApiResponse<CourseProgress[]>> {
        return this.http.get<ApiResponse<CourseProgress[]>>
        (`${this.apiUrl}/progress`);
    }
}