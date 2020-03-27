import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarTiendaComponent } from './gestionar-tienda.component';

describe('GestionarTiendaComponent', () => {
  let component: GestionarTiendaComponent;
  let fixture: ComponentFixture<GestionarTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
