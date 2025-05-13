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
  currentYear: number = new Date().getFullYear(); // Año actual, mostrado en el footer
  producto: Producto | null = null; // Producto que se mostrará en detalle
  nuevaDescripcion: string = ''; // Descripción personalizada para algunos productos

  constructor(
    private ruta: ActivatedRoute, // Permite acceder a los parámetros de la URL
    private productoServicio: ProductService, // Servicio para obtener producto por ID
    private cartService: CartService, // Servicio del carrito para agregar productos
    private router: Router // Para redirigir al usuario
  ) {}

  ngOnInit() {
    const idProducto = this.ruta.snapshot.paramMap.get('id'); // Obtener el ID del producto desde la URL
    if (idProducto) {
      this.productoServicio.getProductoById(Number(idProducto)).subscribe(
        (producto) => {
          this.producto = producto; // Asignar el producto recibido
          console.log('producto: ', this.producto)
          this.asignarDescripcionPersonalizada(Number(idProducto)); // Generar descripción personalizada
        },
        (error) => {
          console.error('Error al obtener el producto:', error);
        }
      );
    }
  }

  // Asignar una descripción específica según el ID del producto
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
        this.nuevaDescripcion = this.producto?.descripcion || 'Descripción no disponible'; // Usar la descripción original si no se encuentra un caso personalizado
        break;
    }
  }

  // Agregar el producto actual al carrito de compras
  anadirAlCarrito() {
    if (this.producto) {
      this.cartService.agregarAlCarrito(this.producto);
      alert(`Producto "${this.producto.nombre}" añadido al carrito.`);
    }
  }

   // Agregar al carrito y redirigir al usuario a la vista del carrito
  comprarAhora() {
    if (this.producto) {
      this.cartService.agregarAlCarrito(this.producto);
      this.router.navigate(['/cart']);
    }
  }

}
