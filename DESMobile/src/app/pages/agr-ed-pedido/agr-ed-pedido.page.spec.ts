import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgrEdPedidoPage } from './agr-ed-pedido.page';

describe('AgrEdPedidoPage', () => {
  let component: AgrEdPedidoPage;
  let fixture: ComponentFixture<AgrEdPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgrEdPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
