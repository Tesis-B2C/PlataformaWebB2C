import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMiCuentaComponent } from './menu-mi-cuenta.component';

describe('MenuMiCuentaComponent', () => {
  let component: MenuMiCuentaComponent;
  let fixture: ComponentFixture<MenuMiCuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuMiCuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuMiCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
