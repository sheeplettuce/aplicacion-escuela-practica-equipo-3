export interface Pedido {
  id: number;
  folio: string;
  mesa: string;
  total: number;
  items: string[];
  estado: 'Proceso' | 'Listo';
}