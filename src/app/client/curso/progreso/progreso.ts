import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CourseProgress } from '../../../models/CourseProgressDto';
import { ProgressService } from '../service/ProgressService';
import { ClientCourse } from '../../../models/ClientCourseDto';

@Component({
  selector: 'app-progreso',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './progreso.html',
  styleUrl: './progreso.scss',
})
export class ProgresoComponent implements OnInit {

  course: ClientCourse[] = [];
  cursos: any[] = [];
  cursosEnProgreso: any[] = [];
  cursosCompletados: any[] = [];
  courses: CourseProgress[] = [];
  isLoading = true;
  userName: string = '';
  tabActivo: 'progreso' | 'completados' = 'progreso';

  private progressService = inject(ProgressService);

  constructor(private cd: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('google_token');
    const userId = this.getUserIdFromToken(token);

    this.userName = localStorage.getItem('user_name') ?? '';

    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.progressService.getCourseProgress().subscribe({

      next: (res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        this.cursos = data;
        this.courses = data;
        this.separarCursos();
        this.isLoading = false;

        this.cd.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  private getUserIdFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  separarCursos() {
    this.cursosEnProgreso = this.cursos.filter(c => c.progressPercentage < 100);
    this.cursosCompletados = this.cursos.filter(c => c.progressPercentage === 100);
  }

  get progresoGlobal(): number {
    if (this.courses.length === 0) return 0;
    const suma = this.courses.reduce((acc, c) => acc + c.progressPercentage, 0);
    return Math.round(suma / this.courses.length);
  }

  getStatus(p: number): string {
    if (p >= 75) return 'Optimal';
    if (p >= 40) return 'Stable';
    return 'Initializing';
  }

  onCourseClick(course: CourseProgress): void {
    this.router.navigate(['/client/curso/contenido', course.courseId]);
  }
}