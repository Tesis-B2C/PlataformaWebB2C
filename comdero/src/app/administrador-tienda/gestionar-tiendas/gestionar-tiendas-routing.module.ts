import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuGestionTiendasComponent} from "./menu-gestion-tiendas/menu-gestion-tiendas.component";


const routes: Routes = [
  { path: 'menu-gestion-tienda', component: MenuGestionTiendasComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarTiendasRoutingModule { }
