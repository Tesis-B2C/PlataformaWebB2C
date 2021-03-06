import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalleTiendaRoutingModule } from './detalle-tienda-routing.module';
import { InicioTiendaComponent } from './inicio-tienda/inicio-tienda.component';

import { EncabezadoTiendaComponent } from './encabezado-tienda/encabezado-tienda.component';
import { EncuentranosTiendaComponent } from './encuentranos-tienda/encuentranos-tienda.component';
import { InformacionTiendaComponent } from './informacion-tienda/informacion-tienda.component';
import { TerminosTiendaComponent } from './terminos-tienda/terminos-tienda.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [InicioTiendaComponent, EncabezadoTiendaComponent, EncuentranosTiendaComponent, InformacionTiendaComponent, TerminosTiendaComponent],
  imports: [
    CommonModule,
    DetalleTiendaRoutingModule,
    NgbModule,
    FormsModule

  ]
})
export class DetalleTiendaModule { }
