import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPlatilloComponent } from './registro-platillo-component';

describe('RegistroPlatilloComponent', () => {
  let component: RegistroPlatilloComponent;
  let fixture: ComponentFixture<RegistroPlatilloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPlatilloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroPlatilloComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
