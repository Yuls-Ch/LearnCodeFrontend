import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-cliente.html',
  styleUrl: './editar-cliente.scss',
})
export class EditarClienteComponent implements OnInit {
  email!: string;

  cliente: any = {
    fullName: '',
    email: '',
    photo: '',
    role: '',
    status: ''
  };

  mostrarConfirmacion = false;
  mostrarExito = false;
  mostrarError = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email')!;

    this.cargarCliente();
  }

  cargarCliente() {
    this.http.get<any>(
      `http://localhost:8080/api/admin/gestionCliente/${encodeURIComponent(this.email)}`
    ).subscribe({

      next: (resp) => {
        this.cliente = resp.data;
        this.cd.detectChanges();
      },

      error: (err) => {
        console.error('Error al cargar cliente', err);
      }

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
      fullName: this.cliente.fullName,
      role: this.cliente.role,
      status: this.cliente.status
    };

    this.http.put(
      `http://localhost:8080/api/admin/gestionCliente/${encodeURIComponent(this.email)}`,
      body
    ).subscribe({
      next: (resp: any) => {
        if (resp?.success === true) {
          this.mostrarExito = true;
        } else {
          this.mostrarError = true;
        }
        this.cd.detectChanges();
      }
    });
  }

  irListado() {
    this.router.navigate(['/admin/gestionCliente']);
  }

  cancelar() {
    this.router.navigate(['/admin/gestionCliente']);
  }

  aceptarExito() {
    this.mostrarExito = false;
    this.router.navigate(['/admin/gestionCliente']);
  }

  cerrarError() {
    this.mostrarError = false;
  }
}
