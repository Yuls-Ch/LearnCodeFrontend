import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSuscripcion } from './editar-suscripcion';

describe('EditarSuscripcion', () => {
  let component: EditarSuscripcion;
  let fixture: ComponentFixture<EditarSuscripcion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarSuscripcion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarSuscripcion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
