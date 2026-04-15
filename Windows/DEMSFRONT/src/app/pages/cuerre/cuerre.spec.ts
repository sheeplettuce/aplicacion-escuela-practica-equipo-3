import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cuerre } from './cuerre';

describe('Cuerre', () => {
  let component: Cuerre;
  let fixture: ComponentFixture<Cuerre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cuerre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cuerre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
