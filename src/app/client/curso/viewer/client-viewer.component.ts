import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ClientContentService } from '../service/ClientContentService';
import { CourseModule } from '../../../service/AdminContentService';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-client-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-viewer.component.html',
  styleUrls: ['./client-viewer.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ClientViewerComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private clientService = inject(ClientContentService);
  private sanitizer = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courseId: string = '';
  modules: CourseModule[] = [];
  completedModuleIds: Set<string> = new Set();
  
  currentModule: CourseModule | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf = false;
  
  // Progreso
  progressPercentage = 0;

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

 loadData() {
    // 1. Cargar Módulos
    this.clientService.getModules(this.courseId).subscribe((res: any) => {
      this.zone.run(() => {
        // Aseguramos que modules sea un array, extrayendo 'data' si viene envuelto
        this.modules = res.data ? res.data : (Array.isArray(res) ? res : []);
        
        // 2. Cargar Progreso
        this.clientService.getProgress(this.courseId).subscribe((progressRes: any) => {
          // Aseguramos extraer el array del progreso
          const completedIdsArray = progressRes.data ? progressRes.data : (Array.isArray(progressRes) ? progressRes : []);
          this.completedModuleIds = new Set(completedIdsArray);
          
          this.calculateProgress();
          
          // Auto-seleccionar el primero o el siguiente disponible
          if (this.modules.length > 0 && !this.currentModule) {
             this.selectModule(this.modules[0]);
          }
          this.cd.markForCheck();
        });
      });
    });
  }

  calculateProgress() {
    // Verificación de seguridad extra por si this.modules no es un array válido
    if (!this.modules || !Array.isArray(this.modules) || this.modules.length === 0) {
        this.progressPercentage = 0;
        return;
    }
    const completedCount = this.modules.filter(m => this.completedModuleIds.has(m.id!)).length;
    this.progressPercentage = Math.round((completedCount / this.modules.length) * 100);
  }

  selectModule(module: CourseModule) {
    this.zone.run(() => {
        this.currentModule = module;
        this.pdfUrl = null;
        
        if (module.files && module.files.length > 0) {
            this.loadPdf(module.files[0].id);
        } else {
            this.isLoadingPdf = false;
        }
    });
  }

loadPdf(fileId: string) {
    this.isLoadingPdf = true;
    this.cd.detectChanges();

    this.clientService.getFileContent(fileId).subscribe({
        next: (res: any) => {
            this.zone.run(() => {
                const base64String = res.data ? res.data.base64 : res.base64;
                
                if (!base64String) {
                    console.error("No se encontró el contenido base64 en la respuesta", res);
                    this.isLoadingPdf = false;
                    return;
                }

                const url = this.base64ToBlobUrl(base64String);
                this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
                this.isLoadingPdf = false;
                this.cd.markForCheck();
            });
        },
        error: () => {
            this.zone.run(() => this.isLoadingPdf = false);
        }
    });
  }
  markAsCompleted() {
    if (!this.currentModule?.id) return;
    
    // Optimista: Marcar visualmente ya
    this.completedModuleIds.add(this.currentModule.id!);
    this.calculateProgress();

    this.clientService.markAsCompleted(this.currentModule.id!).subscribe({
        next: () => {
            Swal.fire({
                icon: 'success',
                title: '¡Módulo Completado!',
                text: `Has completado el ${this.progressPercentage}% del curso`,
                timer: 2000,
                showConfirmButton: false,
                backdrop: `rgba(0,0,123,0.4)`
            });
        }
    });
  }



  private base64ToBlobUrl(base64: string): string {
    try {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        return URL.createObjectURL(blob);
    } catch { return ''; }
  }
}