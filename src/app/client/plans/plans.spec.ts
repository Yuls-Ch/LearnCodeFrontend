import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlansComponent } from './plans';
import { PlanService } from '../../service/PlanService';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────
const plansMock = [
  { code: 'FREE',     name: 'Gratis',   price: 0  },
  { code: 'ORO',      name: 'Oro',      price: 19 },
  { code: 'PLATINO',  name: 'Platino',  price: 29 },
  { code: 'DIAMANTE', name: 'Diamante', price: 39 }
];

const planServiceMock = {
  getPlans:          () => of({ data: plansMock }),
  getMySubscription: () => of({ data: { planCode: 'ORO', status: 'ACTIVE' } })
};

// ActivatedRoute mock con queryParams vacíos (sin ?success=true)
const activatedRouteMock = {
  queryParams: of({})
};

// US-05: Como estudiante, quiero ver los planes de suscripción
// disponibles para entender el valor de la plataforma antes
// de suscribirme.

describe('PlansComponent - US-05 Planes de Suscripción', () => {
  let component: PlansComponent;
  let fixture: ComponentFixture<PlansComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.setItem('google_token', 'fake-token');

    await TestBed.configureTestingModule({
      imports: [PlansComponent, HttpClientTestingModule],
      providers: [
        { provide: PlanService,     useValue: planServiceMock    },
        { provide: ActivatedRoute,  useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlansComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // AAA - Test 1
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // AAA - Test 2
  it('debe cargar los 4 planes de suscripción', () => {
    expect(component.plans.length).toBe(4);
    expect(component.plans.map(p => p.code))
      .toEqual(['FREE', 'ORO', 'PLATINO', 'DIAMANTE']);
  });

  // AAA - Test 3
  it('debe detectar el plan activo del usuario', () => {
    expect(component.currentPlan).toBe('ORO');
  });

  // AAA - Test 4
  it('debe marcar loading como false después de cargar', () => {
    expect(component.loading).toBe(false);
  });

  // AAA - Test 5
  it('selectPlan no debe hacer nada si se selecciona el plan actual', () => {
    component.currentPlan = 'ORO';
    const buySpy = vi.spyOn(component, 'buy');
    component.selectPlan('ORO');
    expect(buySpy).not.toHaveBeenCalled();
  });

  // AAA - Test 6
  it('selectPlan debe llamar a buy si el usuario no tiene plan activo', () => {
    component.currentPlan = null;
    const buySpy = vi.spyOn(component, 'buy').mockImplementation(() => {});
    component.selectPlan('PLATINO');
    expect(buySpy).toHaveBeenCalledWith('PLATINO');
  });

  // AAA - Test 7
  it('debe mostrar los planes con sus nombres correctos', () => {
    expect(component.plans[0].name).toBe('Gratis');
    expect(component.plans[1].name).toBe('Oro');
    expect(component.plans[2].name).toBe('Platino');
    expect(component.plans[3].name).toBe('Diamante');
  });

});