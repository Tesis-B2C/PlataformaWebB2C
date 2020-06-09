import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuGestionTiendasComponent} from "../../administrador-tienda/gestionar-tiendas/menu-gestion-tiendas/menu-gestion-tiendas.component";
import {ProductosComponent} from "../../administrador-tienda/gestionar-tiendas/productos/productos.component";
import {MetodosPagoComponent} from "../../administrador-tienda/gestionar-tiendas/metodos-pago/metodos-pago.component";
import {MetodosEnvioComponent} from "../../administrador-tienda/gestionar-tiendas/metodos-envio/metodos-envio.component";
import {MenuMiCuentaComponent} from "./menu-mi-cuenta/menu-mi-cuenta.component";
import {VisionGeneralComponent} from "./vision-general/vision-general.component";


const routes: Routes = [
  { path: 'menu-mi-cuenta', component: MenuMiCuentaComponent ,
    children: [
     { path: 'vision-general', component: VisionGeneralComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiCuentaRoutingModule { }
