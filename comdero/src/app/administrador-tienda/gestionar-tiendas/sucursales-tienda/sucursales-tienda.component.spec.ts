import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesTiendaComponent } from './sucursales-tienda.component';

describe('SucursalesTiendaComponent', () => {
  let component: SucursalesTiendaComponent;
  let fixture: ComponentFixture<SucursalesTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalesTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalesTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
