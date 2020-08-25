import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {EncabezadoComponent} from "../administrador-tienda/encabezado/encabezado.component";
import {TiendasComponent} from "./tiendas/tiendas.component";
import {AuthGuard} from "../shared/guards/auth.guard";

const routes: Routes = [{path:'administrador-tienda', component:EncabezadoComponent,
  children: [
    { path: 'mis-tiendas', component: TiendasComponent },
    { path: 'gestion-tienda', loadChildren:'./gestionar-tiendas/gestionar-tiendas.module#GestionarTiendasModule',canActivate:[AuthGuard]}]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class AdministradorTiendaRoutingModule { }
