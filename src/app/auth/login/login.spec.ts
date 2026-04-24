import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { ActivatedRoute, provideRouter  } from '@angular/router';
import { vi } from 'vitest';

// US-05: Como estudiante de LearnCode, quiero ver una página de bienvenida 
// atractiva con información sobre los planes de suscripción,
// para entender el valor de la plataforma antes de iniciar sesión.

describe('LoginComponent - US-05 Landing Page', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: any;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter ([]),
        { provide: ActivatedRoute, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Evita que initGoogle() rompa el test por ausencia de la API de Google
    vi.spyOn(component, 'initGoogle' as any).mockImplementation(() => {});
    vi.spyOn(component, 'initParticles' as any).mockImplementation(() => {});
    vi.spyOn(component, 'initStatsObserver' as any).mockImplementation(() => {});
    vi.spyOn(component, 'initRevealObserver' as any).mockImplementation(() => {});

    fixture.detectChanges();
  });

  it('debe crear el componente (landing page accesible)', () => {
    expect(component).toBeTruthy();
  });

  it('el modal debe estar cerrado por defecto', () => {
    expect(component.modalOpen).toBe(false);
  });

  it('openModal debe abrir el modal de login', () => {
    component.modalOpen = false;
    component.openModal();
    expect(component.modalOpen).toBe(true);
  });

  it('closeModal debe cerrar el modal de login', () => {
    component.modalOpen = true;
    component.closeModal();
    expect(component.modalOpen).toBe(false);
  });

  it('billingAnnual debe iniciar en false y cambiar con toggleBilling', () => {
    expect(component.billingAnnual).toBe(false);
    component.toggleBilling();
    expect(component.billingAnnual).toBe(true);
  });

});