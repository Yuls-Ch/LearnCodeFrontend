import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoSuscripcion } from './listado-suscripcion';

describe('ListadoSuscripcion', () => {
  let component: ListadoSuscripcion;
  let fixture: ComponentFixture<ListadoSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoSuscripcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
