import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from './response/ApiResponse';
import { IncomePlanDto } from '../models/IncomePlanDto'; 
import { CourseViewsDto } from '../models/CourseViewsDto';
import { StudentPlanDto } from '../models/StudentPlanDto';
import { MonthlyIncomeDto } from '../models/MonthlyIncomeDto';

@Injectable({ providedIn: 'root' })
export class AdminStatisticsService {

    private readonly endpointCat = 'http://localhost:8080/api/admin/statisticsCat';
    private readonly endpointSub = 'http://localhost:8080/api/admin/statisticsSub';

    constructor(private readonly http: HttpClient) { }

    // Cursos más vistos
    getMostViewedCourses(): Observable<ApiResponse<CourseViewsDto[]>> {
        return this.http.get<ApiResponse<CourseViewsDto[]>>(
            `${this.endpointCat}/most-viewed-courses`
        );
    }

    // Ingresos por plan
    getIncomeByPlan(): Observable<ApiResponse<IncomePlanDto[]>> {
        return this.http.get<ApiResponse<IncomePlanDto[]>>(
            `${this.endpointSub}/income-by-plan`
        );
    }

    // Estudiantes por plan
    getStudentsByPlan(): Observable<ApiResponse<StudentPlanDto[]>> {
        return this.http.get<ApiResponse<StudentPlanDto[]>>(
            `${this.endpointSub}/students-by-plan`
        );
    }

    // Ingresos por mes
    getIncomeByMonth(): Observable<ApiResponse<MonthlyIncomeDto[]>> {
        return this.http.get<ApiResponse<MonthlyIncomeDto[]>>(
            `${this.endpointSub}/income-by-month`
        );
    }

}