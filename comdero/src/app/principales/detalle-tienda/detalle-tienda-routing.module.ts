import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {InicioTiendaComponent} from "./inicio-tienda/inicio-tienda.component";

import {EncabezadoTiendaComponent} from "./encabezado-tienda/encabezado-tienda.component";
import {EncuentranosTiendaComponent} from "./encuentranos-tienda/encuentranos-tienda.component";



const routes: Routes = [
  {
    path: 'tienda/:id', component: EncabezadoTiendaComponent,
    children: [
      {path: 'inicio-tienda', component: InicioTiendaComponent},
      {path: 'encuentranos-tienda', component: EncuentranosTiendaComponent},

    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})


export class DetalleTiendaRoutingModule {
}
