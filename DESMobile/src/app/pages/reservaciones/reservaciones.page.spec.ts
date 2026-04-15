import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReservacionesPage } from './reservaciones.page';

describe('ReservacionesPage', () => {
  let component: ReservacionesPage;
  let fixture: ComponentFixture<ReservacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
