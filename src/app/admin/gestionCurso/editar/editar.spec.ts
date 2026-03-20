import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCourse } from './EditCourse'

describe('Editar', () => {
  let component: EditCourse;
  let fixture: ComponentFixture<EditCourse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCourse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCourse);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
