export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria_id: number;
  categoria_nombre: string;
  stock_disponible: number;
}
