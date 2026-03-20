import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from "@angular/router";

interface Slide {
  image: string;
  tag: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
})
export class HomeAdmin implements OnInit {
  totalCourses = 0;
  totalUsers = 0;
  dailyIncome = 0;

  currentIndex: number = 0;
  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      tag: 'Clientes',
      title: 'Gestión de Clientes',
      description: 'Revisa, agrega o bloquea usuarios, actualiza información y controla su estado.'
    },
    {
      image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68',
      tag: 'Suscripciones',
      title: 'Control de Suscripciones',
      description: 'Administra planes activos, renueva suscripciones y verifica pagos pendientes.'
    },
    {
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
      tag: 'Cursos',
      title: 'Gestión de Cursos',
      description: 'Crea, edita y publica cursos; organiza módulos y archivos asociados.'
    },
    {
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      tag: 'Contenido',
      title: 'Revisión de Contenido',
      description: 'Verifica documentos, videos y recursos subidos por instructores.'
    }
  ];
  autoPlayInterval: any;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();

    this.startAutoPlay();
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);

    this.autoPlayInterval = setInterval(() => {
      this.ngZone.run(() => {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.cdr.detectChanges();
      });
    }, 5000);
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.restartAutoPlay();
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.restartAutoPlay();
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.restartAutoPlay();
  }

  private restartAutoPlay() {
    this.startAutoPlay();
  }

  private loadDashboardData() {
    this.http.get<{
      totalCourses: number;
      totalUsers: number;
      dailyIncome: number;
    }>('http://localhost:8080/api/admin/dashboard')
      .subscribe(data => {
        this.totalCourses = data.totalCourses ?? 0;
        this.totalUsers = data.totalUsers ?? 0;
        this.dailyIncome = data.dailyIncome ?? 0;

        this.cdr.detectChanges();
      });
  }
}
