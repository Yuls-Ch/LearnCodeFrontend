import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import { AdminCourseService } from '../../../service/AdminCourseService';

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
        this.course = res.data;
        this.cd.detectChanges();        
      },
      error: () => {
        alert('No se pudo cargar el curso');
        this.router.navigate(['/admin/gestionCurso/listado']);
      }
    });
  }


  volver(): void {
    this.router.navigate(['/admin/gestionCurso/listado']);
  }
}
