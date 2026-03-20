import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ClientCourse } from '../../models/ClientCourseDto';
import { ClientCourseService } from './service/CourseService';
import { PlanService } from '../../service/PlanService';

@Component({
  selector: 'app-curso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './curso.html',
  styleUrl: './curso.scss',
})
export class CursoComponent implements OnInit {

  courses: ClientCourse[] = [];
  filteredCourses: ClientCourse[] = [];

  subscriptionPlanCode: string = 'FREE';
  hasSubscription: boolean = false;
  searchTitle: string = '';
  selectedCategory: string | null = null;
  selectedCourse: ClientCourse | null = null;
  showFilters: boolean = false;
  showPricingModal: boolean = false;


  readonly categories: string[] = [
    'Backend',
    'Frontend',
    'Mobile',
    'DevOps',
    'Data Science',
  ];

  private readonly planLevels: Record<string, number> = {
    FREE: 0,
    ORO: 1,
    PLATINO: 2,
    DIAMANTE: 3,
  };

  private normalizePlan(code: string | null | undefined): string {
    if (!code) return "FREE";

    return code
      .trim()
      .toUpperCase()
      .replace("PLAN_", "")
      .replace("PLAN ", "")
      .replace(" ", "");
  }


  constructor(
    private readonly router: Router,
    private cd: ChangeDetectorRef,
    private readonly courseService: ClientCourseService,
    private readonly planService: PlanService
  ) { }

  ngOnInit(): void {
    this.loadSubscriptionAndCourses();
  }

  private loadSubscriptionAndCourses(): void {
    this.planService.getMySubscription().subscribe({
      next: (sub) => {
        if (sub?.data.status === 'ACTIVE') {
          this.subscriptionPlanCode = sub.data.planCode;
          this.hasSubscription = true;

          console.log("PLAN RECIBIDO:", sub.data.planCode);
        } else {
          this.setFreeUser();
        }

        this.loadCourses();
        this.cd.detectChanges();
      },
      error: () => {
        console.warn('Usuario sin suscripción → FREE');
        this.setFreeUser();
        this.loadCourses();
      },
    });
  }

  private setFreeUser(): void {
    this.subscriptionPlanCode = 'FREE';
    this.hasSubscription = false;
  }

  private loadCourses(): void {
    this.courseService.list().subscribe({
      next: (res) => {
        console.log("Datos crudos del servidor:", res);

        const data = res.data

        data.forEach(c => {
          console.log("CURSO:", c.title,
            "| isFree:", c.isFree,
            "| requiredPlanCode:", c.requiredPlanCode,
          );
        });


        this.courses = data.map((course) => ({
          ...course,
          unlocked: this.canAccessCourse(course),
          modulesCount: course.modulesCount || 0,
          filesCount: course.filesCount || 0
        }));

        this.filteredCourses = [...this.courses];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando cursos:', err);

        console.error("ERROR COMPLETO:", err);
        console.error("STATUS:", err.status);
        console.error("MENSAJE:", err.message);
        console.error("ERROR BACKEND:", err.error);


      },
    });
  }

  private canAccessCourse(course: ClientCourse): boolean {
    if (course.isFree) return true;

    if (!course.requiredPlanCode) {
      console.warn("Curso sin plan requerido:", course.title);
      return false;
    }

    const required = this.normalizePlan(course.requiredPlanCode);
    const user = this.normalizePlan(this.subscriptionPlanCode) ?? "FREE";

    const userLevel = this.planLevels[user] ?? 0;
    const courseLevel = this.planLevels[required] ?? 999;

    return userLevel >= courseLevel;
  }



  private updateUnlockedCourses(): void {
    this.courses = this.courses.map(course => ({
      ...course,
      unlocked: this.canAccessCourse(course)
    }));

    this.filteredCourses = [...this.courses];
  }

  search(): void {
    const query = this.searchTitle.trim().toLowerCase();

    this.filteredCourses = query
      ? this.courses.filter((c) =>
        c.title.toLowerCase().includes(query)
      )
      : [...this.courses];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    this.filteredCourses = this.courses.filter((course) =>
      course.subtitle?.toLowerCase().includes(category.toLowerCase())
    );
  }

  clearFilters(): void {
    this.selectedCategory = null;
    this.filteredCourses = [...this.courses];
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  isColor(value: string): boolean {
    return (
      value.startsWith('#') ||
      value.startsWith('rgb')
    );
  }

  getCoursePlan(course: ClientCourse): string {
    if (course.isFree) return "GRATIS";
    const plan = course.requiredPlanCode?.trim().toUpperCase();
    if (!plan) return "FREE";
    return plan;
  }

  getGlowClassByIndex(index: number): string {
    const glows = [
      'card-glow-cyan',
      'card-glow-indigo',
      'card-glow-pink',
      'card-glow-green',
      'card-glow-orange',
    ];

    return glows[index % glows.length];
  }

  getCardStyle(course: ClientCourse) {
    if (this.isColor(course.coverUrl)) {
      return {
        '--card-glow': course.coverUrl,
        borderColor: course.coverUrl,
      };
    }

    return {
      '--card-glow': 'rgba(0,255,255,0.25)',
    };
  }

  onCourseClick(course: ClientCourse): void {
    if (!this.canAccessCourse(course)) {
      this.selectedCourse = course;
      this.showPricingModal = true;
      return;
    }

    console.log("Acceso permitido");
    console.log('Entrar al curso:', course.title);
    this.router.navigate(['/client/curso/contenido', course.id]);
  }

  goToPlans(): void {
    this.closeModal();
    this.router.navigate(['/client/plans']);
  }

  closeModal(): void {
    this.showPricingModal = false;
    this.selectedCourse = null;
  }
}
