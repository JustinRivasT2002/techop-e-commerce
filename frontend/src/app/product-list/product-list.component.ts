import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { Producto } from '../interfaces/producto.interfaces';

@Component({
  selector: 'app-product-list',
  standalone: false,

  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit{
  productos: Producto[] = []; // Lista de productos cargados desde el servicio
  currentYear: number = new Date().getFullYear(); // Año actual para mostrar en el footer
  filtro: string = ''; // Texto del filtro de búsqueda

  constructor(private productService: ProductService, private router: Router) {}

  // Cargar los productos al iniciar el componente
  ngOnInit() {
    this.cargarProductos();
  }

  // Llama al servicio para obtener productos desde el backend
  cargarProductos() {
    this.productService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data; // Almacena los productos recibidos
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Devuelve los productos que coinciden con el filtro de búsqueda
  productosFiltrados(): Producto[] {
    if (!this.filtro) {
      return this.productos; // Si no hay filtro, devuelve todos los productos
    }

    // Filtra los productos por nombre (uso de toLowerCase para hacer la búsqueda insensible a mayúsculas/minúsculas)
    const filtrados = this.productos.filter(producto =>
      (producto.nombre?.toLowerCase().includes(this.filtro.toLowerCase()))
    );

    console.log('Productos filtrados:', filtrados); // Log para depuración
    return filtrados;
}

// Redirige al usuario a la vista del producto seleccionado
comprar(producto: Producto) {
  this.router.navigate(['/products', producto.id]);
}
}
