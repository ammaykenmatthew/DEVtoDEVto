import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegModeratorComponent } from './reg-moderator.component';

describe('RegModeratorComponent', () => {
  let component: RegModeratorComponent;
  let fixture: ComponentFixture<RegModeratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegModeratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
