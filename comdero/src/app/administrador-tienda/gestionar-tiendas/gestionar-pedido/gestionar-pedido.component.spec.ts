import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPedidoComponent } from './gestionar-pedido.component';

describe('GestionarPedidoComponent', () => {
  let component: GestionarPedidoComponent;
  let fixture: ComponentFixture<GestionarPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
