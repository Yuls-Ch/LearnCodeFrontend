import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('DashboardComponent - Admin', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let routerMock: any;
  let router: Router;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [ provideRouter([]) ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate')

    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe leer userName desde localStorage', () => {
    localStorage.setItem('user_name', 'Yuliana');
    component.ngOnInit();
    expect(component.userName).toBe('Yuliana');
  });

  it('debe usar "Admin" si no hay user_name en localStorage', () => {
    component.ngOnInit();
    expect(component.userName).toBe('Admin');
  });

  it('toggleMenu debe alternar menuOpen', () => {
    component.menuOpen = false;
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
  });

  it('logout debe limpiar localStorage y navegar a /', () => {
    localStorage.setItem('user_name', 'Test');
    component.logout();
    expect(localStorage.getItem('user_name')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });
});