import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlvidoContraseniaComponent } from './olvido-contrasenia.component';

describe('OlvidoContraseniaComponent', () => {
  let component: OlvidoContraseniaComponent;
  let fixture: ComponentFixture<OlvidoContraseniaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlvidoContraseniaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlvidoContraseniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
