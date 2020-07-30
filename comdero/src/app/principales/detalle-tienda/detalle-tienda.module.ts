import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleTiendaRoutingModule } from './detalle-tienda-routing.module';
import { InicioTiendaComponent } from './inicio-tienda/inicio-tienda.component';

import { EncabezadoTiendaComponent } from './encabezado-tienda/encabezado-tienda.component';
import { EncuentranosTiendaComponent } from './encuentranos-tienda/encuentranos-tienda.component';
import { InformacionTiendaComponent } from './informacion-tienda/informacion-tienda.component';



@NgModule({
  declarations: [InicioTiendaComponent, EncabezadoTiendaComponent, EncuentranosTiendaComponent, InformacionTiendaComponent],
  imports: [
    CommonModule,
    DetalleTiendaRoutingModule,

  ]
})
export class DetalleTiendaModule { }
