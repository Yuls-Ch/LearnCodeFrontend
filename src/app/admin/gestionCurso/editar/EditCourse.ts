import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { AdminCourseService } from '../../../service/AdminCourseService';
import { PlanService } from '../../../service/PlanService';
import { CloudinaryService } from '../../../service/CloudinaryService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { Plan } from '../../../models/Plan';

@Component({
  selector: 'app-edit-course',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar.html'
})
export class EditCourse implements OnInit {

  form!: FormGroup;
  plans: Plan[] = [];
  courseId!: string;
  iconPreview: string | null = null;
  selectedIconFile: File | null = null;
  originalIconUrl!: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private courseService: AdminCourseService,
    private planService: PlanService,
    private cloudinaryService: CloudinaryService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadPlans();
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      coverUrl: ['#000000', Validators.required],
      isFree: [true],
      requiredPlanCode: ['FREE'],
      published: ['false']
    });

    this.form.get('requiredPlanCode')?.valueChanges.subscribe(code => {
      if (code === 'FREE') {
        this.form.patchValue({
          isFree: true
        }, { emitEvent: false });
      } else {
        this.form.patchValue({
          isFree: false
        }, { emitEvent: false });
      }
    });
  }

  private loadPlans(): void {
  this.planService.getPlans().subscribe({
    next: (res) => {
      this.plans = res.data;
      
      this.cd.detectChanges();

      if (!this.plans.some(p => p.code === 'FREE')) {
        this.plans.unshift({
          code: 'FREE',
          name: 'Acceso Libre',
          description: 'Curso de acceso gratuito',
          price: 0,
          durationDays: 0
        } as Plan);
      }

      this.loadCourse();
    },
    error: () => Swal.fire('Error', 'No se pudieron cargar los planes', 'error')
  });
}

  private loadCourse(): void {
    this.courseService.getById(this.courseId).subscribe({
      next: (res) => {
        const course = res.data;
        const isFree = course.free === true;

        this.form.patchValue({
          title: course.title,
          subtitle: course.subtitle,
          description: course.description,
          coverUrl: course.coverUrl,
          requiredPlanCode: isFree ? 'FREE' : (course.requiredPlanCode ?? 'FREE'),
          published: course.published ? 'true' : 'false'
        });

        this.originalIconUrl = course.iconUrl;
        this.iconPreview = course.iconUrl;

        setTimeout(() => this.cd.detectChanges());
      },
      error: () => Swal.fire('Error', 'No se pudo cargar el curso', 'error')
    });
  }

  onIconSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedIconFile = file;

    const reader = new FileReader();
    reader.onload = () => this.iconPreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  private prepareCourseData(): AdminCourseDto {
    const formValues = this.form.value;
    const free = formValues.requiredPlanCode === 'FREE';
    const published = formValues.published === true;

    return {
      id: this.courseId,
      title: formValues.title,
      subtitle: formValues.subtitle,
      description: formValues.description,
      iconUrl: this.originalIconUrl,
      coverUrl: formValues.coverUrl,
      requiredPlanCode: free ? null : formValues.requiredPlanCode,
      free: free,
      published: formValues.published === 'true',
      createdAt: ''
    };
  }

  updateCourse(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Formulario inválido', 'Completa todos los campos correctamente', 'warning');
      return;
    }

    const courseData = this.prepareCourseData();

    console.log("Payload enviado:", courseData);

    const save = () => {
      this.courseService.update(this.courseId, courseData).subscribe({

        next: () => {
          Swal.fire('¡Curso actualizado!', '', 'success').then(() => {
            this.router.navigate(['/admin/gestionCurso/listado']);
          });
        },
        error: (err) => {
          Swal.fire('Error', err.error?.message || 'No se pudo actualizar', 'error');
        }
      });
    };

    if (this.selectedIconFile) {
      this.cloudinaryService.uploadIcon(this.selectedIconFile).subscribe({
        next: url => {
          courseData.iconUrl = url;
          save();
        },
        error: () => Swal.fire('Error', 'No se pudo subir la imagen', 'error')
      });
    } else {
      save();
    }
  }

  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }
}
