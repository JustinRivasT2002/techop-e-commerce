import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Producto } from '../interfaces/producto.interfaces';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  producto: Producto | null = null; // Producto actual
  nuevaDescripcion: string = ''; // Descripción personalizada del producto

  constructor(
    private ruta: ActivatedRoute, // Ruta activa para obtener parámetros
    private productoServicio: ProductService, // Servicio del producto
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const idProducto = this.ruta.snapshot.paramMap.get('id'); // Obtener el ID de la URL
    if (idProducto) {
      this.productoServicio.getProductoById(Number(idProducto)).subscribe(
        (producto) => {
          this.producto = producto; // Asignar el producto encontrado
          console.log('producto: ', this.producto)
          this.asignarDescripcionPersonalizada(Number(idProducto)); // Llamar a la función para asignar descripción personalizada
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }

  asignarDescripcionPersonalizada(idProducto: number) {
    switch (idProducto) {
      case 1:
        this.nuevaDescripcion = 'Esta es una laptop de alto rendimiento, ideal para gamers y profesionales creativos.';
        break;
      case 2:
        this.nuevaDescripcion = 'Tarjeta gráfica de última generación, perfecta para gaming y edición de video.';
        break;
      case 3:
        this.nuevaDescripcion = 'Teclado mecánico con iluminación RGB personalizable para una experiencia única.';
        break;
      default:
        this.nuevaDescripcion = this.producto?.descripcion || 'Descripción no disponible';
        break;
    }
  }

  anadirAlCarrito() {
    if (this.producto) {
      this.cartService.agregarAlCarrito(this.producto);
      alert(`Producto "${this.producto.nombre}" añadido al carrito.`);
    }
  }

  comprarAhora() {
    if (this.producto) {
      this.cartService.agregarAlCarrito(this.producto);
      this.router.navigate(['/cart']);
    }
  }

}
