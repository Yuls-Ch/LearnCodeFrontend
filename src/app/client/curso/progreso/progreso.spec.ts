import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgresoComponent } from './progreso';
import { ProgressService } from '../service/ProgressService';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

describe('ProgresoComponent - Vitest', () => {
  let component: ProgresoComponent;
  let fixture: ComponentFixture<ProgresoComponent>;

  let progressServiceMock: any;
  let routerMock: any;

  const cursosMock = [
    { courseId: '1', title: 'Angular', progressPercentage: 60 },
    { courseId: '2', title: 'Spring Boot', progressPercentage: 100 },
    { courseId: '3', title: 'Vue', progressPercentage: 20 }
  ];

  beforeEach(async () => {

    progressServiceMock = {
      getCourseProgress: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    const fakePayload = btoa(JSON.stringify({ sub: 'user-123' }));
    const fakeToken = `header.${fakePayload}.signature`;

    localStorage.setItem('google_token', fakeToken);
    localStorage.setItem('user_name', 'Yuliana');

    await TestBed.configureTestingModule({
      imports: [ProgresoComponent],
      providers: [
        { provide: ProgressService, useValue: progressServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgresoComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar cursos y separar correctamente', () => {
    progressServiceMock.getCourseProgress.mockReturnValue(of({ data: cursosMock }));

    fixture.detectChanges();

    expect(progressServiceMock.getCourseProgress).toHaveBeenCalled();

    expect(component.cursosEnProgreso.length).toBe(2);
    expect(component.cursosCompletados.length).toBe(1);
    expect(component.isLoading).toBe(false);
  });

  it('no debe llamar al servicio si no hay token', () => {
    localStorage.removeItem('google_token');

    fixture.detectChanges();

    expect(progressServiceMock.getCourseProgress).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('no debe llamar al servicio si el token es inválido', () => {
    localStorage.setItem('google_token', 'token-invalido');

    fixture.detectChanges();

    expect(progressServiceMock.getCourseProgress).not.toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
  });

  it('debe manejar error del servicio correctamente', () => {
    progressServiceMock.getCourseProgress.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();

    expect(component.isLoading).toBe(false);
  });

  it('progresoGlobal debe calcular promedio', () => {
    component.courses = cursosMock as any;

    expect(component.progresoGlobal).toBe(60);
  });

  it('progresoGlobal debe ser 0 si no hay cursos', () => {
    component.courses = [];
    expect(component.progresoGlobal).toBe(0);
  });

  it('getStatus debe retornar estado correcto', () => {
    expect(component.getStatus(80)).toBe('Optimal');
    expect(component.getStatus(50)).toBe('Stable');
    expect(component.getStatus(10)).toBe('Initializing');
  });

  it('debe navegar al hacer click en curso', () => {
    const curso = { courseId: 'abc' } as any;

    component.onCourseClick(curso);

    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/client/curso/contenido', 'abc']
    );
  });

  it('debe leer el nombre desde localStorage', () => {
    progressServiceMock.getCourseProgress.mockReturnValue(of({ data: cursosMock }));

    fixture.detectChanges();

    expect(component.userName).toBe('Yuliana');
  });

});