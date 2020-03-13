import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidoContraseniaPaso2Component } from './olvido-contrasenia-paso2.component';

describe('OlvidoContraseniaPaso2Component', () => {
  let component: OlvidoContraseniaPaso2Component;
  let fixture: ComponentFixture<OlvidoContraseniaPaso2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidoContraseniaPaso2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidoContraseniaPaso2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
