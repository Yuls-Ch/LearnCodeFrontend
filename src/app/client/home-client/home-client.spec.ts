import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HomeClient } from './home-client';

// US-06: Como estudiante de Learncode, quiero que la 
// información esté disponible en todo momento, para 
// poder acceder sin interrupciones.

describe('HomeClient - US-06', () => {
  let component: HomeClient;
  let fixture: ComponentFixture<HomeClient>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [HomeClient, RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeClient);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  // AAA - Test 1
  it('debe crear el componente correctamente', () => {
    expect(component).toBeTruthy();
  });

  // AAA - Test 2
  it('debe mostrar "Usuario" por defecto si no hay sesión activa', () => {
    component.ngOnInit();
    expect(component.userName).toBe('Usuario');
  });

  // AAA - Test 3
  it('debe leer el nombre del usuario desde localStorage', () => {
    localStorage.setItem('user_name', 'Yuliana');
    component.ngOnInit();
    expect(component.userName).toBe('Yuliana');
  });

});