import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosFacturacionComponent } from './datos-facturacion.component';

describe('DatosFacturacionComponent', () => {
  let component: DatosFacturacionComponent;
  let fixture: ComponentFixture<DatosFacturacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosFacturacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
