import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionGeneralComponent } from './vision-general.component';

describe('VisionGeneralComponent', () => {
  let component: VisionGeneralComponent;
  let fixture: ComponentFixture<VisionGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisionGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
