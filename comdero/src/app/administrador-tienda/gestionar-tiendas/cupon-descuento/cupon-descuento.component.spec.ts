import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponDescuentoComponent } from './cupon-descuento.component';

describe('CuponDescuentoComponent', () => {
  let component: CuponDescuentoComponent;
  let fixture: ComponentFixture<CuponDescuentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponDescuentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
