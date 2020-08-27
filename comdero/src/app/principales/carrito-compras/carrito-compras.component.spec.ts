import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoComprasComponent } from './carrito-compras.component';

describe('CarritoComprasComponent', () => {
  let component: CarritoComprasComponent;
  let fixture: ComponentFixture<CarritoComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarritoComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
