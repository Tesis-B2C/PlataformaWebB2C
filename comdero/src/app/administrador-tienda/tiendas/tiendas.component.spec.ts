import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendasComponent } from './tiendas.component';

describe('TiendasComponent', () => {
  let component: TiendasComponent;
  let fixture: ComponentFixture<TiendasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiendasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
