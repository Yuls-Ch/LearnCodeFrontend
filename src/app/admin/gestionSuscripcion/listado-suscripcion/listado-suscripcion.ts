import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listado-suscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './listado-suscripcion.html',
  styleUrl: './listado-suscripcion.scss',
})
export class ListadoSuscripcion implements OnInit {
  suscripciones: any[] = [];

  page = 0;
  size = 5;
  totalPages = 0;

  plan = 'TODO';
  status = 'TODO';

  etiquetasPlan: any = {
    'FREE': 'Gratis',
    'ORO': 'Oro',
    'PLATINO': 'Platino',
    'DIAMANTE': 'Diamante'
  };

  etiquetasEstado: any = {
    'ACTIVE': 'Activo',
    'CANCELED': 'Cancelado',
    'EXPIRED': 'Expirado'
  };

  private apiUrl = 'http://localhost:8080/api/admin/gestionSuscripcion';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarSuscripciones();
  }

  cargarSuscripciones() {
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString())
      .set('plan', this.plan)
      .set('status', this.status);

    this.http.get<{ success: boolean, mensaje: string, data: any }>(this.apiUrl, { params }).subscribe({
      next: resp => {
        if (resp.success) {
          this.suscripciones = resp.data.content ?? [];
          this.totalPages = resp.data.totalPages ?? 0;
          this.page = resp.data.number ?? 0;

          this.cd.detectChanges();
        } else {
          console.error('Error API:', resp.mensaje);
        }
      },
      error: err => {
        console.error('ERROR:', err);
      }
    });
  }

  aplicarFiltros() {
    this.page = 0;
    this.cargarSuscripciones();

    this.cd.detectChanges();
  }

  resetFiltros() {
    this.plan = 'TODO';
    this.status = 'TODO';
    this.page = 0;
    this.cargarSuscripciones();

    this.cd.detectChanges();
  }

  cambiarPagina(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.cargarSuscripciones();
    this.cd.detectChanges();
  }
}
