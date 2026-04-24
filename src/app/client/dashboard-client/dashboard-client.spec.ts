import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardClient } from './dashboard-client';
import { RouterModule, provideRouter, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { vi } from 'vitest';

describe('DashboardClient - Cliente', () => {
  let component: DashboardClient;
  let fixture: ComponentFixture<DashboardClient>;
  let routerMock: any;
  let router: Router;

  beforeEach(async () => {
    routerMock = { navigate: vi.fn() };

    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DashboardClient, RouterModule.forRoot([]), MarkdownModule.forRoot()],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardClient);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('toggleMenu debe alternar menuOpen', () => {
    component.menuOpen = false;
    component.toggleMenu();
    expect(component.menuOpen).toBe(true);
  });

  it('logout debe limpiar localStorage y navegar a /', () => {
    localStorage.setItem('user_photo', 'foto.jpg');
    component.logout();
    expect(localStorage.getItem('user_photo')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/'], { replaceUrl: true });
  });

  it('toggleTheme debe alternar isDarkMode', () => {
    component.isDarkMode = false;
    component.toggleTheme();
    expect(component.isDarkMode).toBe(true);
  });
});