export interface PedidoE {
  idPedido: number;
  folio: string;
  mesa?: string;
  items: any[];
  estado: string;
  tipo: number;
  TrabajadorId: number;
}