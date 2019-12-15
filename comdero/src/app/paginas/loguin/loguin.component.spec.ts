import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoguinComponent } from './loguin.component';

describe('LoguinComponent', () => {
  let component: LoguinComponent;
  let fixture: ComponentFixture<LoguinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoguinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoguinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
