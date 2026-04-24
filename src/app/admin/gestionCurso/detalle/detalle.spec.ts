import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCourse } from './DetailCourse';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

const courseMock = {
  id: '1',
  title: 'Angular',
  subtitle: 'Sub',
  description: 'Descripción del curso',
  iconUrl: '',
  coverUrl: '#000',
  free: true,
  requiredPlanCode: 'FREE',
  published: true,
  createdAt: ''
};

describe('DetailCourse - Vitest', () => {
  let component: DetailCourse;
  let fixture: ComponentFixture<DetailCourse>;

  let courseServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as any);

    courseServiceMock = {
      getById: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn()
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [DetailCourse],
      providers: [
        { provide: AdminCourseService, useValue: courseServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCourse);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar el curso correctamente', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
    courseServiceMock.getById.mockReturnValue(of({ data: courseMock }));

    fixture.detectChanges(); // dispara ngOnInit

    expect(courseServiceMock.getById).toHaveBeenCalledWith('1');
    expect(component.course.title).toBe('Angular');
    expect(component.course.published).toBe(true);
    expect(component.course.free).toBe(true);
  });

  it('debe redirigir si no hay id en la ruta', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);

    fixture.detectChanges();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });

  it('debe mostrar error y redirigir si falla el servicio', async () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
    courseServiceMock.getById.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(Swal.fire).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });

  it('volver debe navegar al listado', () => {
    component.volver();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });
});