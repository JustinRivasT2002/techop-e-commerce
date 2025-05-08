import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartComponent } from '../cart/cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';
import { ProfileComponent } from '../profile/profile.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { AboutUsComponent } from '../about-us/about-us.component';
import { AccountComponent } from '../account/account.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,  // Página principal del e-commerce
    title: 'Home',
  },
  {
    path: 'products',
    component: ProductListComponent,  // Lista de productos
    title: 'Product List'
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent, // contiene el id de un producto especifico
    title: 'Product Detail'
  },
  {
    path: 'cart',
    component: CartComponent,  // Carrito de compras
    title: 'Cart'
  },
  {
    path: 'checkout',
    component: CheckoutComponent,  // Proceso de pago
    title: 'Checkout'
  },
  {
    path: 'order-summary',
    component: OrderSummaryComponent,  // Resumen de la orden
    title: 'Order Summary'
  },
  {
    path: 'account',
    component: AccountComponent,  // Resumen de la orden
    title: 'Account',
  },
  {
    path: 'profile',
    component: ProfileComponent,  // Perfil de usuario
    title: 'Profile'
  },
  {
    path: 'about-us',
    component: AboutUsComponent,  // sobre nosotros
    title: 'About us'
  },
  {
    path: '**',
    component: NotFoundComponent,  // Página no encontrada
    title: '404 - Not Found'
  }
];
