import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePedidoRealizadoComponent } from './detalle-pedido-realizado.component';

describe('DetallePedidoRealizadoComponent', () => {
  let component: DetallePedidoRealizadoComponent;
  let fixture: ComponentFixture<DetallePedidoRealizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePedidoRealizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePedidoRealizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
