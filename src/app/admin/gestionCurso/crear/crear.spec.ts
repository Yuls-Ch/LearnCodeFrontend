import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsertCourse } from './InsertCourse';
import { AdminCourseService } from '../../../service/AdminCourseService';
import { PlanService } from '../../../service/PlanService';
import { CloudinaryService } from '../../../service/CloudinaryService';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import Swal from 'sweetalert2';

const planServiceMock = {
  getPlans: vi.fn(() => of({ data: [] }))
};

const courseServiceMock = {
  create: vi.fn(() => of({}))
};

const cloudinaryServiceMock = {
  uploadIcon: vi.fn(() => of('Angular_Frontend.png'))
};

const routerMock = {
  navigate: vi.fn()
};

describe('InsertCourse - Gestión de Cursos (Admin)', () => {
  let component: InsertCourse;
  let fixture: ComponentFixture<InsertCourse>;

  beforeEach(async () => {
    vi.spyOn(Swal,'fire').mockResolvedValue({ isConfirmed: true } as any);

    await TestBed.configureTestingModule({
      imports: [InsertCourse],
      providers: [
        { provide: AdminCourseService, useValue: courseServiceMock },
        { provide: PlanService, useValue: planServiceMock },
        { provide: CloudinaryService, useValue: cloudinaryServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InsertCourse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar planes en ngOnInit', () => {
    expect(planServiceMock.getPlans).toHaveBeenCalled();
  });

  it('el formulario debe ser inválido si está vacío', () => {
    component.form.setValue({
      title: '',
      subtitle: '',
      description: '',
      coverUrl: '',
      free: false,
      requiredPlanCode: '',
      isPublished: false
    });

    expect(component.form.invalid).toBe(true);
  });

  it('el formulario debe ser válido con datos correctos', () => {
    component.form.setValue({
      title: 'Curso de Angular',
      subtitle: 'Aprende Angular desde cero',
      description: 'Este curso cubre todos los conceptos básicos de Angular paso a paso.',
      coverUrl: '#FF0000',
      free: false,
      requiredPlanCode: 'ORO',
      isPublished: true
    });

    expect(component.form.valid).toBe(true);
  });

  it('si el curso es gratuito, debe asignar FREE como plan requerido', () => {
    component.form.get('free')?.setValue(true);
    expect(component.form.get('requiredPlanCode')?.value).toBe('FREE');
  });

  it('no debe crear curso si formulario es inválido', () => {
    component.form.get('title')?.setValue('');

    component.createCourse();

    expect(courseServiceMock.create).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('no debe crear curso si no hay imagen', () => {
    component.form.patchValue({
      title: 'Curso válido',
      subtitle: 'Subtitulo válido',
      description: 'Descripción larga válida de más de 20 caracteres',
      coverUrl: '#000',
      free: false,
      requiredPlanCode: 'ORO',
      isPublished: true
    });

    component.createCourse();

    expect(cloudinaryServiceMock.uploadIcon).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalled();
  });

  it('debe crear curso correctamente', async () => {
    component.iconFile = new File(['img'], 'test.png');

    component.form.patchValue({
      title: 'Curso válido',
      subtitle: 'Subtitulo válido',
      description: 'Descripción larga válida de más de 20 caracteres',
      coverUrl: '#000',
      free: false,
      requiredPlanCode: 'ORO',
      isPublished: true
    });

    component.createCourse();
    await Promise.resolve(); //observable
    await Promise.resolve(); //then

    expect(cloudinaryServiceMock.uploadIcon).toHaveBeenCalled();
    expect(courseServiceMock.create).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin/gestionCurso/listado']);
  });

});