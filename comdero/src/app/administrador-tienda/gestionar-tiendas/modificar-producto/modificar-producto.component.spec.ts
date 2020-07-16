import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarProductoComponent } from './modificar-producto.component';

describe('ModificarProductoComponent', () => {
  let component: ModificarProductoComponent;
  let fixture: ComponentFixture<ModificarProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
