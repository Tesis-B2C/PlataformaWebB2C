import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosTiendaComponent } from './terminos-tienda.component';

describe('TerminosTiendaComponent', () => {
  let component: TerminosTiendaComponent;
  let fixture: ComponentFixture<TerminosTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminosTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminosTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
