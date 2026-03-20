import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailCourse } from './DetailCourse';

describe('Detalle', () => {
  let component: DetailCourse;
  let fixture: ComponentFixture<DetailCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailCourse]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
