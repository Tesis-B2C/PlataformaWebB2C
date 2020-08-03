import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionTiendaComponent } from './informacion-tienda.component';

describe('InformacionTiendaComponent', () => {
  let component: InformacionTiendaComponent;
  let fixture: ComponentFixture<InformacionTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
