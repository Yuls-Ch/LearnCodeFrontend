import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarSuscripcion } from './editar-suscripcion';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest'; 

// ── Mocks ────────────────────────────────────────────────────
const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: (_: string) => 'sub-123'  // ID de suscripción simulado
    }
  }
};

const routerMock = {
  navigate: vi.fn()
};


// // US-17 (Admin): Como administrador del sistema, quiero que los 
// datos estén centralizados en la nube, para garantizar 
// disponibilidad y escalabilidad.

describe('EditarSuscripcion - Gestión de Suscripciones', () => {
  let component: EditarSuscripcion;
  let fixture: ComponentFixture<EditarSuscripcion>;
  let httpMock: HttpTestingController;

  const suscripcionMock = {
    id: 'sub-123',
    fullName: 'Yuliana Chambi',
    photo: '',
    plan: 'ORO',
    status: 'ACTIVE'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSuscripcion, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router,         useValue: routerMock         }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarSuscripcion);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/admin/gestionSuscripcion/sub-123'
    );
    req.flush({ success: true, mensaje: 'ok', data: suscripcionMock });
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  // AAA - Test 1
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // AAA - Test 2
  it('debe cargar los datos de la suscripción desde la API', () => {
    expect(component.suscripcion.fullName).toBe('Yuliana Chambi');
    expect(component.suscripcion.plan).toBe('ORO');
    expect(component.suscripcion.status).toBe('ACTIVE');
  });

  // AAA - Test 3
  it('abrirConfirmacion debe mostrar el modal de confirmación', () => {
    component.mostrarConfirmacion = false;
    component.abrirConfirmacion();
    expect(component.mostrarConfirmacion).toBe(true);
  });

  // AAA - Test 4
  it('cancelarConfirmacion debe ocultar el modal de confirmación', () => {
    component.mostrarConfirmacion = true;
    component.cancelarConfirmacion();
    expect(component.mostrarConfirmacion).toBe(false);
  });

  // AAA - Test 5
  it('confirmarGuardar debe enviar PUT y mostrar éxito', () => {
    component.mostrarConfirmacion = true;
    component.suscripcion = { ...suscripcionMock, plan: 'PLATINO' };
    component.confirmarGuardar();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/admin/gestionSuscripcion/sub-123'
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
    expect(component.mostrarConfirmacion).toBe(false);
    expect(component.mostrarExito).toBe(true);
  });

  // AAA - Test 6
  it('cancelar debe navegar al listado de suscripciones', () => {
    component.cancelar();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionSuscripcion']);
  });

  // AAA - Test 7
  it('aceptarExito debe ocultar el mensaje y navegar al listado', () => {
    component.mostrarExito = true;
    component.aceptarExito();
    expect(component.mostrarExito).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionSuscripcion']);
  });

  // AAA - Test 8
  it('planLabels debe contener las etiquetas correctas para cada plan', () => {
    expect(component.planLabels['FREE']).toBe('Gratis');
    expect(component.planLabels['ORO']).toBe('Oro');
    expect(component.planLabels['PLATINO']).toBe('Platino');
    expect(component.planLabels['DIAMANTE']).toBe('Diamante');
  });

});