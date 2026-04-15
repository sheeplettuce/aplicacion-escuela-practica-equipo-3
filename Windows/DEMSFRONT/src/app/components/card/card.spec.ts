import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloCardComponent } from './cardComponent';

describe('Card', () => {
  let component: ModuloCardComponent;
  let fixture: ComponentFixture<ModuloCardComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
