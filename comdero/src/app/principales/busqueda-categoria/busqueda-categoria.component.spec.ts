import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaCategoriaComponent } from './busqueda-categoria.component';

describe('BusquedaCategoriaComponent', () => {
  let component: BusquedaCategoriaComponent;
  let fixture: ComponentFixture<BusquedaCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
