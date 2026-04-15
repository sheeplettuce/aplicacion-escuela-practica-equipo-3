import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarPedidosPage } from './editar-pedidos.page';

describe('EditarPedidosPage', () => {
  let component: EditarPedidosPage;
  let fixture: ComponentFixture<EditarPedidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
