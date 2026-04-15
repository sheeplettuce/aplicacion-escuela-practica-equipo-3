import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CobrarPedidoPage } from './cobrar-pedido.page';

describe('CobrarPedidoPage', () => {
  let component: CobrarPedidoPage;
  let fixture: ComponentFixture<CobrarPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrarPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
