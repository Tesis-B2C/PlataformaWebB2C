import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTiendaComponent } from './general-tienda.component';

describe('GeneralTiendaComponent', () => {
  let component: GeneralTiendaComponent;
  let fixture: ComponentFixture<GeneralTiendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralTiendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
