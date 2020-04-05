import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuGestionTiendasComponent} from "./menu-gestion-tiendas/menu-gestion-tiendas.component";
import {ProductosComponent} from "./productos/productos.component";


const routes: Routes = [
  { path: 'menu-gestion-tienda', component: MenuGestionTiendasComponent ,
    children: [
  { path: 'productos', component: ProductosComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarTiendasRoutingModule { }
