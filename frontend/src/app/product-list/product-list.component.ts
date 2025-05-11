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
  productos: Producto[] = [];
  currentYear: number = new Date().getFullYear();
  filtro: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProductos().subscribe(
      (data: Producto[]) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  productosFiltrados(): Producto[] {
    if (!this.filtro) {
      return this.productos; // Si no hay filtro, devuelve todos los productos
    }

    const filtrados = this.productos.filter(producto =>
      (producto.nombre?.toLowerCase().includes(this.filtro.toLowerCase()))
    );

    console.log('Productos filtrados:', filtrados);
    return filtrados;
}

comprar(producto: Producto) {
  this.router.navigate(['/products', producto.id]);  // Navegar solo con el ID
}
}
