import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoPedidosComponent } from './listado-pedidos.component';

describe('ListadoPedidosComponent', () => {
  let component: ListadoPedidosComponent;
  let fixture: ComponentFixture<ListadoPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
