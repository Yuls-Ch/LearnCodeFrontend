import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoClienteComponent } from './listado-cliente';

describe('ListadoCliente', () => {
  let component: ListadoClienteComponent;
  let fixture: ComponentFixture<ListadoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadoClienteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
