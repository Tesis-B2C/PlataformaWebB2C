import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTiendaComponent } from './detalle-tienda.component';

describe('DetalleTiendaComponent', () => {
  let component: DetalleTiendaComponent;
  let fixture: ComponentFixture<DetalleTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
