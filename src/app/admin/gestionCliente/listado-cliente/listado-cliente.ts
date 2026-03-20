import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listado-cliente.html',
  styleUrl: './listado-cliente.scss',
})
export class ListadoClienteComponent implements OnInit {
  clientes: any[] = [];
  page = 0;
  size = 5;
  totalPages = 0;
  search = '';
  status = 'ALL';
  photo?: string;
  loading = false;

  private apiUrl = 'http://localhost:8080/api/admin/gestionCliente';

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  aplicarFiltros() {
    this.page = 0;
    this.cargarClientes();
  }

  onStatusChange() {
    this.page = 0;
    this.cargarClientes();
  }

  cargarClientes() {
    this.loading = true;

    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString())
      .set('role', 'USER')
      .set('search', this.search.trim())
      .set('status', this.status);

    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (resp) => {
        const pageData = resp.data;

        this.clientes = pageData.content.map((c: any) => ({
          ...c,
          photo: c.photo || null
        }));

        this.totalPages = pageData.totalPages;
        this.page = pageData.number;

        this.loading = false;

        this.cd.detectChanges();
      },

      error: () => {
        this.loading = false;
      }
    });
  }

  resetFiltros() {
    this.search = '';
    this.status = 'ALL';
    this.page = 0;
    this.cargarClientes();
  }

  cambiarPagina(p: number) {
    if (p < 0 || p >= this.totalPages) return;
    this.page = p;
    this.cargarClientes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
