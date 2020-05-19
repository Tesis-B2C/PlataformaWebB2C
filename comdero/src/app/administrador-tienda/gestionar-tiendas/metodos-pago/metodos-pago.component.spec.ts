import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodosPagoComponent } from './metodos-pago.component';

describe('MetodosPagoComponent', () => {
  let component: MetodosPagoComponent;
  let fixture: ComponentFixture<MetodosPagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodosPagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
