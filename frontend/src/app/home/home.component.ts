// home.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  texts: string[] = [
    "Welcome To Techop store",
    "here you will find everything you need to be at the forefront of technology",
    "a space for component lovers",
    "computers",
    "towers",
    "and much more"
  ];
  index: number = 0;

  ngOnInit(): void {
    // Inicializa la animación del texto
    this.animateText();
    setInterval(() => this.animateText(), 3000); // Cambia el texto cada 3 segundos
  }

  animateText(): void {
    const dynamicText = document.getElementById("dynamic-text");
    if (dynamicText) {
      dynamicText.innerHTML = ""; // Limpia el contenido anterior
      const currentText = this.texts[this.index];

      // Divide el texto en letras y las agrega con un pequeño retraso
      currentText.split("").forEach((letter, i) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.animationDelay = `${i * 0.1}s`; // Retraso para cada letra
        dynamicText.appendChild(span);
      });

      // Actualiza el índice
      this.index = (this.index + 1) % this.texts.length;
    }
  }
}
