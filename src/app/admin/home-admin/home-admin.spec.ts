import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeAdmin } from './home-admin';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { vi } from 'vitest';

// US-07 (Admin): Como administrador del sistema, quiero que los 
// datos estén centralizados en la nube, para garantizar 
// disponibilidad y escalabilidad.

describe('HomeAdmin - US-07 Dashboard Admin', () => {
  let component: HomeAdmin;
  let fixture: ComponentFixture<HomeAdmin>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAdmin, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAdmin);
    component = fixture.componentInstance;

    httpMock = TestBed.inject(HttpTestingController);

    vi.spyOn(component, 'startAutoPlay')

    fixture.detectChanges();
  });
  
  afterEach(() => {
    httpMock.verify();
  });

  // Test 1
  it('debe crear el componente correctamente', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });

    expect(component).toBeTruthy();
  });

  // Test 2
  it('debe cargar los datos del dashboard desde la API', () => {
    const dashboardMock = { totalCourses: 6, totalUsers: 4, dailyIncome: 99.97 };
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush(dashboardMock);
    expect(component.totalCourses).toBe(6);
    expect(component.totalUsers).toBe(4);
    expect(component.dailyIncome).toBe(99.97);
  });

  // Test 3
  it('nextSlide debe avanzar al siguiente slide', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });
    component.currentIndex = 0;
    component.nextSlide();
    expect(component.currentIndex).toBe(1);
  });

  // Test 4
  it('nextSlide debe volver al inicio cuando llega al último slide', () => {
    // ARRANGE
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });
    component.currentIndex = component.slides.length - 1;
    component.nextSlide();
    expect(component.currentIndex).toBe(0);
  });

  // Test 5
  it('prevSlide debe retroceder al slide anterior', () => {
    // ARRANGE
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });
    component.currentIndex = 2;
    component.prevSlide();
    expect(component.currentIndex).toBe(1);
  });

  // Test 6
  it('prevSlide debe ir al último slide si está en el primero', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });
    component.currentIndex = 0;
    component.prevSlide();
    expect(component.currentIndex).toBe(component.slides.length - 1);
  });

  // Test 7
  it('goToSlide debe ir directamente al índice indicado', () => {
    const req = httpMock.expectOne('http://localhost:8080/api/admin/dashboard');
    req.flush({ totalCourses: 0, totalUsers: 0, dailyIncome: 0 });
    component.currentIndex = 0;
    component.goToSlide(3);
    expect(component.currentIndex).toBe(3);
  });

});