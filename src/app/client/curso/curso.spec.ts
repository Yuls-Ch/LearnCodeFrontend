import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CursoComponent } from './curso';

describe('Curso', () => {
  let component: CursoComponent;
  let fixture: ComponentFixture<CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
