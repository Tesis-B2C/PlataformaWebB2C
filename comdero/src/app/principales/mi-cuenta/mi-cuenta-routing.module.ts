import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {MenuMiCuentaComponent} from "./menu-mi-cuenta/menu-mi-cuenta.component";
import {VisionGeneralComponent} from "./vision-general/vision-general.component";
import {DatosPersonalesComponent} from "./datos-personales/datos-personales.component";

import {CambiarContraseniaComponent} from "./cambiar-contrasenia/cambiar-contrasenia.component";
import {PedidosRealizadosComponent} from "./pedidos-realizados/pedidos-realizados.component";
import {DetallePedidoRealizadoComponent} from "./detalle-pedido-realizado/detalle-pedido-realizado.component";


const routes: Routes = [
  { path: 'menu-mi-cuenta', component: MenuMiCuentaComponent ,
    children: [
     { path: 'vision-general', component: VisionGeneralComponent },
      { path: 'datos-personales', component: DatosPersonalesComponent },
      { path: 'cambiar-contrasenia', component: CambiarContraseniaComponent },
      { path: 'pedidos-realizados', component: PedidosRealizadosComponent },
      { path: 'detalle-pedido-realizado/:id', component: DetallePedidoRealizadoComponent },
     ]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiCuentaRoutingModule { }
