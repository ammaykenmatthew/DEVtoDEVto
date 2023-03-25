import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintChartComponent } from './print-chart.component';

describe('PrintChartComponent', () => {
  let component: PrintChartComponent;
  let fixture: ComponentFixture<PrintChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
