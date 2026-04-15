import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosACobrarPage } from './pedidos-acobrar.page';

describe('PedidosACobrarPage', () => {
  let component: PedidosACobrarPage;
  let fixture: ComponentFixture<PedidosACobrarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosACobrarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
