import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarClienteComponent } from './editar-cliente';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';

const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: () => 'test@email.com'
    }
  }
};

describe('EditarClienteComponent - Gestión de Clientes', () => {
  let component: EditarClienteComponent;
  let fixture: ComponentFixture<EditarClienteComponent>;
  let httpMock: HttpTestingController;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EditarClienteComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarClienteComponent);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // AAA
  it('debe crear el componente', () => {
    // Arrange
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `http://localhost:8080/api/admin/gestionCliente/${encodeURIComponent('test@email.com')}`
    );
    req.flush({
      data: {
        fullName: 'Nicolas',
        email: 'test@email.com',
        role: 'USER',
        status: 'ACTIVE'
      }
    });

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  // AAA
  it('debe cargar los datos del cliente', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      `http://localhost:8080/api/admin/gestionCliente/${encodeURIComponent('test@email.com')}`
    );
    req.flush({
      data: {
        fullName: 'Nicolas',
        email: 'test@email.com',
        role: 'USER',
        status: 'ACTIVE'
      }
    });

    fixture.detectChanges();

    expect(component.cliente.fullName).toBe('Nicolas');
    expect(component.cliente.role).toBe('USER');
  });

  it('abrirConfirmacion debe mostrar el modal', () => {
    component.abrirConfirmacion();
    expect(component.mostrarConfirmacion).toBe(true);
  });

  it('cancelarConfirmacion debe ocultar el modal', () => {
    component.mostrarConfirmacion = true;
    component.cancelarConfirmacion();
    expect(component.mostrarConfirmacion).toBe(false);
  });

  it('cancelar debe navegar al listado de clientes', () => {
    component.cancelar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCliente']);
  });
});