import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentpostComponent } from './studentpost.component';

describe('StudentpostComponent', () => {
  let component: StudentpostComponent;
  let fixture: ComponentFixture<StudentpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentpostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
