import { Producto } from "./producto.interfaces";

export interface ProductoEnCarrito extends Producto{
  cantidad: number;
}
