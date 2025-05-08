import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule
import { AppRoutes } from './helpers/routes';  // Rutas exportadas desde routes.ts

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],  // Usa forRoot para configurar las rutas
  exports: [RouterModule]  // Exporta el RouterModule para que sea accesible en toda la aplicación
})
export class AppRoutingModule { }
