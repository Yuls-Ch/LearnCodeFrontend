import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';
import { AdminContentService, CourseModule } from '../../../service/AdminContentService';

@Component({
  selector: 'app-content-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(5px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ContentManagerComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private contentService = inject(AdminContentService);
  private sanitizer = inject(DomSanitizer);
  private cd = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  courseId: string = '';
  modules: CourseModule[] = [];
  
  currentModule: CourseModule | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  isLoadingPdf = false;
  hasAnyContent = false;
  activeDropdownId: string | null = null;

  showModuleModal = false;
  showUploadModal = false;
  
  isEditing = false;
  moduleForm = { title: '' };
  selectedFile: File | null = null;
  previewPdfUrl: SafeResourceUrl | null = null;

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id') || '';
    this.loadModules(true);
  }

 loadModules(isInitialLoad = false) {
    this.contentService.getModulesByCourse(this.courseId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          this.modules = res.data ? res.data : (Array.isArray(res) ? res : []);
          
          this.hasAnyContent = this.modules.some(m => m.files && m.files.length > 0);

          if (isInitialLoad && this.hasAnyContent) {
            const firstWithFile = this.modules.find(m => m.files && m.files.length > 0);
            if (firstWithFile) {
              this.selectModule(firstWithFile);
            }
          } 
          else if (this.currentModule) {
            const refreshed = this.modules.find(m => m.id === this.currentModule!.id);
            if (refreshed) {
              this.currentModule = refreshed;
              if (refreshed.files && refreshed.files.length > 0 && !this.pdfUrl) {
                  this.loadPdf(refreshed.files[0].id);
              }
            }
          }
          this.cd.markForCheck();
        });
      },
      error: () => console.error('Error cargando módulos')
    });
  }

  loadPdf(fileId: string) {
    this.isLoadingPdf = true;
    this.cd.detectChanges();

    this.contentService.getFileContent(fileId).subscribe({
      next: (res: any) => {
        this.zone.run(() => {
          const base64String = res.data ? res.data.base64 : res.base64;
          
          if (!base64String) {
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
        this.zone.run(() => {
          this.isLoadingPdf = false;
          Swal.fire('Error', 'No se pudo cargar el PDF', 'error');
        });
      }
    });
  }

  selectModule(module: CourseModule) {
    this.zone.run(() => {
      this.currentModule = module;
      this.pdfUrl = null;
      this.activeDropdownId = null;

      if (module.files && module.files.length > 0) {
        this.loadPdf(module.files[0].id);
      } else {
        this.isLoadingPdf = false;
      }
    });
  }



  trackByFn(index: number, item: CourseModule) {
    return item.id; 
  }

  toggleDropdown(moduleId: string, event: Event) {
    event.stopPropagation();
    if (this.activeDropdownId === moduleId) {
      this.activeDropdownId = null;
    } else {
      this.activeDropdownId = moduleId;
    }
  }

  closeDropdowns() {
    this.activeDropdownId = null;
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
    } catch (e) {
        console.error("Error convirtiendo base64", e);
        return '';
    }
  }

  openCreateModule() {
    if (this.modules.length >= 5) {
      Swal.fire('Límite alcanzado', 'Solo puedes crear hasta 5 módulos', 'warning');
      return;
    }
    this.isEditing = false;
    this.moduleForm = { title: '' };
    this.showModuleModal = true;
  }

  openEditModule(module: CourseModule) {
    this.isEditing = true;
    this.currentModule = module;
    this.moduleForm = { title: module.title };
    this.showModuleModal = true;
    this.activeDropdownId = null;
  }

  saveModule() {
    if (!this.moduleForm.title.trim()) return;

    const request = this.isEditing 
      ? this.contentService.updateModule(this.currentModule!.id!, this.moduleForm.title)
      : this.contentService.createModule(this.courseId, this.moduleForm.title, this.modules.length + 1);

    request.subscribe({
      next: () => {
        this.zone.run(() => {
            this.showModuleModal = false;
            this.loadModules();
            Swal.fire({
                icon: 'success',
                title: this.isEditing ? 'Actualizado' : 'Creado',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
            });
        });
      }
    });
  }

  deleteModule(moduleId: string) {
    this.activeDropdownId = null;
    Swal.fire({
      title: '¿Eliminar módulo?',
      text: 'Se perderá el contenido asociado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contentService.deleteModule(moduleId).subscribe({
          next: () => {
            this.zone.run(() => {
                if (this.currentModule?.id === moduleId) {
                    this.currentModule = null;
                    this.pdfUrl = null;
                }
                this.loadModules(); 
                Swal.fire('Eliminado', '', 'success');
            });
          }
        });
      }
    });
  }

  openUploadModal(module: CourseModule) {
    this.currentModule = module;
    this.selectedFile = null;
    this.previewPdfUrl = null;
    this.showUploadModal = true;
    this.activeDropdownId = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        Swal.fire('Formato incorrecto', 'Solo PDF', 'error');
        return;
      }
      this.selectedFile = file;
      const url = URL.createObjectURL(file);
      this.previewPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  uploadFile() {
    if (!this.selectedFile || !this.currentModule?.id) return;

    Swal.fire({
      title: 'Subiendo...',
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];

      const dto = {
        moduleId: this.currentModule!.id!,
        fileName: this.selectedFile!.name,
        mimeType: this.selectedFile!.type,
        base64: base64String
      };

      this.contentService.uploadFile(dto).subscribe({
        next: () => {
          Swal.close();
          this.zone.run(() => {
              this.showUploadModal = false;
              const instantUrl = URL.createObjectURL(this.selectedFile!);
              this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(instantUrl);
              this.loadModules();
              Swal.fire({
                  icon: 'success',
                  title: 'Contenido actualizado',
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 2000
              });
          });
        },
        error: () => {
          Swal.close();
          Swal.fire('Error', 'Fallo en la subida', 'error');
        }
      });
    };
    
    reader.readAsDataURL(this.selectedFile);
  }
}