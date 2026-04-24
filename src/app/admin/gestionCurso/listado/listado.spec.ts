import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoComponent } from './listado';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

const coursesMock = {
  data: {
    content: [
      { id: '1', title: 'Angular', published: true },
      { id: '2', title: 'Vue', published: false }
    ],
    totalPages: 1
  }
};

describe('ListadoComponent - Gestión de Cursos', () => {
  let component: ListadoComponent;
  let fixture: ComponentFixture<ListadoComponent>;
  let courseServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {    
    courseServiceMock = {
      getPaged: vi.fn(() => of(coursesMock)),
      delete: vi.fn(() => of({}))
    };

    const activatedRouteMock = {
      snapshot: { paramMap: { get: () => null } },
      queryParams: of({})
    };

    routerMock = { navigate: vi.fn() };

    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as any);

    await TestBed.configureTestingModule({
      imports: [ListadoComponent],
      providers: [
        { provide: AdminCourseService, useValue: courseServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar la lista de cursos al iniciar', () => {
    expect(courseServiceMock.getPaged).toHaveBeenCalled();
    expect(component.courses.length).toBe(2);
  });

  it('resetFilters debe limpiar búsqueda y restablecer página a 0', () => {
    component.search = 'Spring';
    component.isPublished = 'true';
    component.page = 3;
    const spy = vi.spyOn(component, 'loadCourses');

    component.resetFilters();

    expect(component.search).toBe('');
    expect(component.isPublished).toBe('ALL');
    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('changePage no debe cambiar de página si el índice es inválido', () => {
    component.page = 0;
    component.totalPages = 2;

    component.changePage(-1);

    expect(component.page).toBe(0);
  });

  it('changePage debe actualizar la página si el índice es válido', () => {
    component.page = 0;
    component.totalPages = 3;
    const spy = vi.spyOn(component, 'loadCourses');

    component.changePage(1);

    expect(component.page).toBe(1);
    expect(spy).toHaveBeenCalled();
  });

  it('applyFilters debe reiniciar la página a 0 y llamar loadCourses', () => {
    component.page = 2;
    component.search = 'Angular';
    const spy = vi.spyOn(component, 'loadCourses');

    component.applyFilters();

    expect(component.page).toBe(0);
    expect(spy).toHaveBeenCalled();
  });

  it('confirmDelete debe eliminar curso cuando el usuario confirma', async () => {
    const spyLoad = vi.spyOn(component, 'loadCourses').mockImplementation(() => { });

    component.confirmDelete('1');
    await fixture.whenStable();

    expect(courseServiceMock.delete).toHaveBeenCalledWith('1');
    expect(spyLoad).toHaveBeenCalled();
  });

});