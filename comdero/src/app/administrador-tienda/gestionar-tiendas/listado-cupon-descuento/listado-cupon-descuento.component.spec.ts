import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoCuponDescuentoComponent } from './listado-cupon-descuento.component';

describe('ListadoCuponDescuentoComponent', () => {
  let component: ListadoCuponDescuentoComponent;
  let fixture: ComponentFixture<ListadoCuponDescuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoCuponDescuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoCuponDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
