import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatisticsComponent } from './statistics';
import { AdminStatisticsService } from '../../service/AdminStatisticsService';
import { of } from 'rxjs';
import { vi } from 'vitest';

const statsMock = {
  getMostViewedCourses: () => of({ data: [{ title: 'Angular', totalViews: 50 }] }),
  getIncomeByPlan: () => of({ data: [{ plan: 'ORO', totalIncome: 200 }] }),
  getStudentsByPlan: () => of({ data: [{ plan: 'ORO', totalStudents: 5 }] }),
  getIncomeByMonth: () => of({ data: [{ month: 1, totalIncome: 100 }] })
};

// US-10: Como administrador, quiero visualizar un panel de 
// estadísticas con gráficos sobre cursos, ingresos y estudiantes, 
// para analizar el rendimiento de la plataforma.

describe('StatisticsComponent - US-10', () => {
  let component: StatisticsComponent;
  let fixture: ComponentFixture<StatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        { provide: AdminStatisticsService, useValue: statsMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    component = fixture.componentInstance;

    // Evita que Chart.js intente dibujar en canvas reales
    vi.spyOn(component, 'loadAllCharts')

    fixture.detectChanges();
  });

  // AAA - Test 1
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // AAA - Test 2
  it('debe iniciar con la pestaña "ingresos" activa', () => {
    expect(component.tabActivo).toBe('ingresos');
  });

  // AAA - Test 3
  it('getMonthName debe retornar el nombre correcto del mes', () => {
    const casos = [
      { input: 1, esperado: 'Ene' },
      { input: 4, esperado: 'Abr' },
      { input: 12, esperado: 'Dic' }
    ];

    casos.forEach(({ input, esperado }) => {
      const resultado = component.getMonthName(input);
      expect(resultado).toBe(esperado);
    });
  });

  // AAA - Test 4
  it('debe llamar a loadAllCharts durante ngAfterViewInit', () => {
    vi.spyOn(component, 'loadAllCharts');
    vi.spyOn(component, 'loadCourses');
    vi.spyOn(component, 'loadIncomeByPlan');
    vi.spyOn(component, 'loadStudentsByPlan');
    vi.spyOn(component, 'loadIncomeByMonth');

    component.ngAfterViewInit();

    expect(component.loadCourses).toHaveBeenCalled();
    expect(component.loadIncomeByPlan).toHaveBeenCalled();
    expect(component.loadStudentsByPlan).toHaveBeenCalled();
    expect(component.loadIncomeByMonth).toHaveBeenCalled();
  });

});
