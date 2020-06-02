import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetodosEnvioComponent } from './metodos-envio.component';

describe('MetodosEnvioComponent', () => {
  let component: MetodosEnvioComponent;
  let fixture: ComponentFixture<MetodosEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodosEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetodosEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
