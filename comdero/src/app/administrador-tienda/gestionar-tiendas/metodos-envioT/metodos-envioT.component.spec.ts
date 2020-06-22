import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodosEnvioTComponent } from './metodos-envioT.component';

describe('MetodosEnvioComponent', () => {
  let component: MetodosEnvioTComponent;
  let fixture: ComponentFixture<MetodosEnvioTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodosEnvioTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosEnvioTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
