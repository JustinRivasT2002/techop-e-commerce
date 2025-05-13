import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  standalone: false,

  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  currentYear: number = new Date().getFullYear(); // Año actual para mostrar en el footer

   // Lista de logos para el slider animado
  logos = [
    { src: 'assets/img/aser.png', alt: 'Aser' },
    { src: 'assets/img/nvidia.png', alt: 'Nvidia' },
    { src: 'assets/img/lenovo.png', alt: 'Lenovo' },
    { src: 'assets/img/legion.png', alt: 'Legion' },
    { src: 'assets/img/ryzen.png', alt: 'Ryzen' },
    { src: 'assets/img/intel.png', alt: 'Intel' },
    { src: 'assets/img/msi.png', alt: 'MSI' },
    { src: 'assets/img/hp.jpg', alt: 'HP' },
    { src: 'assets/img/samsung.png', alt: 'Samsung' },
    { src: 'assets/img/apple.png', alt: 'Apple' }
  ];

  // Lista de imágenes adicionales para un segundo slider o carrusel futuro
  images = [
    { src: 'assets/img/slider2_1.png', alt: 'Slider 1' },
    { src: 'assets/img/slider2_2.png', alt: 'Slider 2' },
    { src: 'assets/img/slider2_3.png', alt: 'Slider 3' },
    { src: 'assets/img/slider2_4.png', alt: 'Slider 4' },
    { src: 'assets/img/slider2_5.png', alt: 'Slider 5' },
    { src: 'assets/img/slider2_6.png', alt: 'Slider 6' },
    { src: 'assets/img/slider2_7.png', alt: 'Slider 7' },
    { src: 'assets/img/slider2_8.png', alt: 'Slider 8' },
    { src: 'assets/img/slider2_9.png', alt: 'Slider 9' }
  ];
}
