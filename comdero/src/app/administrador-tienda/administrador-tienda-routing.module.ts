import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EncabezadoComponent} from "../administrador-tienda/encabezado/encabezado.component";
import {TiendasComponent} from "../administrador-tienda/tiendas/tiendas.component";


const routes: Routes = [{path:'administrador-tienda', component:EncabezadoComponent,
  children: [
    { path: 'tiendas', component: TiendasComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AdministradorTiendaRoutingModule { }
