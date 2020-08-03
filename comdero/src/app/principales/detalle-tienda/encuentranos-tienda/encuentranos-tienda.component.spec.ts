import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncuentranosTiendaComponent } from './encuentranos-tienda.component';

describe('EncuentranosTiendaComponent', () => {
  let component: EncuentranosTiendaComponent;
  let fixture: ComponentFixture<EncuentranosTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncuentranosTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncuentranosTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
