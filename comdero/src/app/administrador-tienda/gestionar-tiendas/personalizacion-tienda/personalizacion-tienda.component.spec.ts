import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizacionTiendaComponent } from './personalizacion-tienda.component';

describe('PersonalizacionTiendaComponent', () => {
  let component: PersonalizacionTiendaComponent;
  let fixture: ComponentFixture<PersonalizacionTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalizacionTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizacionTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
