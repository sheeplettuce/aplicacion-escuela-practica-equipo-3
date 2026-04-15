import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroTrabajadorComponent } from './registro-trabajador-component';

describe('RegistroTrabajadorComponent', () => {
  let component: RegistroTrabajadorComponent;
  let fixture: ComponentFixture<RegistroTrabajadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroTrabajadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroTrabajadorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
