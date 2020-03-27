import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EncabezadoComponent} from "../administrador-tienda/encabezado/encabezado.component";
import {TiendasComponent} from "../administrador-tienda/tiendas/tiendas.component";
import {GestionarTiendaComponent} from "../administrador-tienda/gestionar-tienda/gestionar-tienda.component";

const routes: Routes = [{path:'administrador-tienda', component:EncabezadoComponent,
  children: [
    { path: 'mis-tiendas', component: TiendasComponent },
    { path: 'gestionar-tiendas', component: GestionarTiendaComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AdministradorTiendaRoutingModule { }
