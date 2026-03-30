import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { AdminCourseDto } from '../../../models/AdminCourseDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado.html',
  styleUrls: ['./listado.scss'],
})
export class ListadoComponent implements OnInit {
  courses: AdminCourseDto[] = [];
  pagesArray: number[] = [];

  search: string = '';
  isPublished: string = 'ALL';
  page: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  loading: boolean = false;

  constructor(
    private readonly router: Router,
    private cd: ChangeDetectorRef,
    private readonly courseService: AdminCourseService
  ) { }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;

    const publishedFilter =
      this.isPublished === 'true' ? 'true' :
      this.isPublished === 'false' ? 'false' :
      undefined;

    this.courseService.getPaged(this.page, this.pageSize, this.search, publishedFilter)
      .subscribe({
        next: (res) => {
          this.courses = res.data.content.map(c => ({
            ...c,
            published: c.published === true || (c as any).isPublished === true
          }));
          this.totalPages = res.data.totalPages;
          this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i);
          this.loading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  onPublishedChange(): void {
    this.page = 0;
    this.loadCourses();
  }

  changePage(newPage: number): void {
    if (newPage < 0 || newPage >= this.totalPages) return;
    this.page = newPage;
    this.loadCourses();
    this.cd.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  applyFilters(): void {
    this.page = 0;
    this.loadCourses();
  }

  resetFilters(): void {
    this.search = '';
    this.isPublished = 'ALL';
    this.page = 0;
    this.loadCourses();
    this.cd.detectChanges();
  }

  confirmDelete(courseId: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1e293b',
      color: '#fff'
    }).then(result => {
      if (result.isConfirmed) {
        this.courseService.delete(courseId).subscribe({
          next: () => {
            this.showSuccess('Curso eliminado');
            this.loadCourses();
            this.cd.detectChanges();
          },
          error: () => this.showError('Error al eliminar')
        });
      }
    });
  }

  private showSuccess(message: string): void {
    Swal.fire({ icon: 'success', title: message, timer: 1500, showConfirmButton: false });
  }

  private showError(message: string): void {
    Swal.fire({ icon: 'error', title: 'Error', text: message });
  }
}
