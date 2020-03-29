import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuGestionTiendasComponent } from './menu-gestion-tiendas.component';

describe('MenuGestionTiendasComponent', () => {
  let component: MenuGestionTiendasComponent;
  let fixture: ComponentFixture<MenuGestionTiendasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuGestionTiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuGestionTiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
