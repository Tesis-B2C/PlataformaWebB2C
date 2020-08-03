import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncabezadoTiendaComponent } from './encabezado-tienda.component';

describe('EncabezadoTiendaComponent', () => {
  let component: EncabezadoTiendaComponent;
  let fixture: ComponentFixture<EncabezadoTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncabezadoTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncabezadoTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
