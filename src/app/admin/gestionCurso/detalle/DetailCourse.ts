import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { AdminCourseService } from '../../../service/AdminCourseService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle.html',
})
export class DetailCourse implements OnInit {

  course!: AdminCourseDto;
  
  constructor(
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router,
    private courseService: AdminCourseService 
  ) {}

   ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) {
    this.router.navigate(['/admin/gestionCurso/listado']);
    return;
  }

   this.courseService.getById(id).subscribe({
      next: (res) => {
        const data = res.data;

        this.course = {
          ...data,
          published: data.published === true,
          free: data.free === true,
        };
        
        this.cd.detectChanges();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el curso', 'error');
        this.router.navigate(['/admin/gestionCurso/listado']);
      }
    });
  }


  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }
}
