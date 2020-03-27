import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorTiendaRoutingModule } from './administrador-tienda-routing.module';
import { TiendasComponent } from './tiendas/tiendas.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { GestionarTiendaComponent } from './gestionar-tienda/gestionar-tienda.component';


@NgModule({
  declarations: [TiendasComponent, EncabezadoComponent, GestionarTiendaComponent],
  imports: [
    CommonModule,
    AdministradorTiendaRoutingModule
  ]
})
export class AdministradorTiendaModule { }
