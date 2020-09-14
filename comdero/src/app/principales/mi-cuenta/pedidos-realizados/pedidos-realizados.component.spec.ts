import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosRealizadosComponent } from './pedidos-realizados.component';

describe('PedidosRealizadosComponent', () => {
  let component: PedidosRealizadosComponent;
  let fixture: ComponentFixture<PedidosRealizadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosRealizadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosRealizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
