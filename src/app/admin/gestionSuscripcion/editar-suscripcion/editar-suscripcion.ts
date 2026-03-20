import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-suscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-suscripcion.html',
  styleUrl: './editar-suscripcion.scss',
})
export class EditarSuscripcion implements OnInit {
  id!: string;

  suscripcion: any = {
    id: '',
    fullName: '',
    photo: '',
    plan: '',
    status: ''
  };

  planes: string[] = ['FREE', 'ORO', 'PLATINO', 'DIAMANTE'];

  planLabels: Record<string, string> = {
    FREE: 'Gratis',
    ORO: 'Oro',
    PLATINO: 'Platino',
    DIAMANTE: 'Diamante'
  };

  mostrarConfirmacion = false;
  mostrarExito = false;
  mostrarError = false;
  estadoOriginal!: string;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.cargarSuscripcion();
  }

  cargarSuscripcion() {
    this.http.get<{ success: boolean, mensaje: string, data: any }>(
      `http://localhost:8080/api/admin/gestionSuscripcion/${this.id}`
    ).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.suscripcion = { ...resp.data };
          this.estadoOriginal = this.suscripcion.status;
        } else {
          this.mostrarError = true;
        }
        this.cd.detectChanges();
      },
      error: () => this.mostrarError = true
    });
  }

  abrirConfirmacion() {
    this.mostrarConfirmacion = true;
  }

  cancelarConfirmacion() {
    this.mostrarConfirmacion = false;
  }

  confirmarGuardar() {
    this.mostrarConfirmacion = false;

    const body = {
      id: this.suscripcion.id,
      fullName: this.suscripcion.fullName,
      plan: this.suscripcion.plan,
      status: this.suscripcion.status
    };

    this.http.put(
      `http://localhost:8080/api/admin/gestionSuscripcion/${this.id}`,
      body
    ).subscribe({
      next: () => {
        this.mostrarExito = true;
        this.cd.detectChanges();
      },
      error: () => {
        this.mostrarError = true;
        this.cd.detectChanges();
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/gestionSuscripcion']);
  }

  irListado() {
    this.router.navigate(['/admin/gestionSuscripcion']);
  }

  aceptarExito() {
    this.mostrarExito = false;
    this.irListado();
  }
}
