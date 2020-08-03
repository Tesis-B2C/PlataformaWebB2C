import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarCuponDescuentoComponent } from './modificar-cupon-descuento.component';

describe('ModificarCuponDescuentoComponent', () => {
  let component: ModificarCuponDescuentoComponent;
  let fixture: ComponentFixture<ModificarCuponDescuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarCuponDescuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarCuponDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
