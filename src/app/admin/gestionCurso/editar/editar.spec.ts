import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCourse } from './EditCourse';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { PlanService } from '../../../service/PlanService';
import { CloudinaryService } from '../../../service/CloudinaryService';
import { ActivatedRoute, Router } from '@angular/router';
import { vi } from 'vitest';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

const courseMock = {
  title: 'Angular',
  subtitle: 'Subtitulo curso',
  description: 'Descripción larga del curso de prueba',
  coverUrl: '#fff',
  free: true,
  requiredPlanCode: 'FREE',
  published: false,
  iconUrl: 'http://icon.png'
};

const activatedRouteMock = {
  snapshot: { paramMap: { get: () => 'curso-abc' } }
};

describe('EditCourse - AAA con Vitest', () => {
  let component: EditCourse;
  let fixture: ComponentFixture<EditCourse>;
  let routerMock: any;
  let planServiceMock: any;
  let cloudinaryMock: any;
  let courseServiceMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    planServiceMock = {
      getPlans: vi.fn(() => of({ data: [] }))
    };

    cloudinaryMock = {
      uploadIcon: vi.fn(() => of('http://fake.com/icon.png'))
    };

    courseServiceMock = {
      getById: vi.fn(() => of({ data: courseMock })),
      update:  vi.fn(() => of({}))
    };

    vi.spyOn(Swal, 'fire').mockResolvedValue({ isConfirmed: true } as any);

    await TestBed.configureTestingModule({
      imports: [EditCourse],
      providers: [
        { provide: AdminCourseService, useValue: courseServiceMock },
        { provide: PlanService,        useValue: planServiceMock   },
        { provide: CloudinaryService,  useValue: cloudinaryMock    },
        { provide: Router,             useValue: routerMock        },
        { provide: ActivatedRoute,     useValue: activatedRouteMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks(); 
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar planes y curso en ngOnInit', () => {
    expect(planServiceMock.getPlans).toHaveBeenCalled();
    expect(courseServiceMock.getById.mock.calls[0][0]).toBe('curso-abc');
    expect(component.form.value.title).toBe('Angular');
  });

  it('debe invalidar el formulario si title es corto', () => {
    component.form.get('title')?.setValue('abc');
    expect(component.form.invalid).toBe(true);
  });

  it('updateCourse NO debe llamar servicio si formulario es inválido', () => {
    component.form.get('title')?.setValue('');
    component.updateCourse();
    expect(courseServiceMock.update).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('updateCourse debe actualizar curso sin subir imagen', async () => {
    component.form.patchValue({
      title: 'Curso válido',
      subtitle: 'Subtitulo válido',
      description: 'Descripción larga válida de más de 20 caracteres',
      coverUrl: '#000',
      requiredPlanCode: 'FREE',
      published: 'true'
    });
    component.selectedIconFile = null;

    component.updateCourse();
    await fixture.whenStable(); 

    expect(courseServiceMock.update).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });

  it('updateCourse debe subir imagen antes de guardar', async () => {
    component.selectedIconFile = new File(['img'], 'test.png');
    component.form.patchValue({
      title: 'Curso válido',
      subtitle: 'Subtitulo válido',
      description: 'Descripción larga válida de más de 20 caracteres',
      coverUrl: '#000',
      requiredPlanCode: 'FREE',
      published: 'true'
    });

    component.updateCourse();
    await fixture.whenStable();

    expect(cloudinaryMock.uploadIcon).toHaveBeenCalled();
    expect(courseServiceMock.update).toHaveBeenCalled();
  });

  it('volver debe navegar al listado', () => {
    component.volver();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });

});