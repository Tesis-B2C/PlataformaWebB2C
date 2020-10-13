import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiCuentaRoutingModule } from './mi-cuenta-routing.module';
import { MenuMiCuentaComponent } from './menu-mi-cuenta/menu-mi-cuenta.component';
import { VisionGeneralComponent } from './vision-general/vision-general.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import {FormsModule} from "@angular/forms";

import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';
import { PedidosRealizadosComponent } from './pedidos-realizados/pedidos-realizados.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DetallePedidoRealizadoComponent } from './detalle-pedido-realizado/detalle-pedido-realizado.component';

@NgModule({
  declarations: [MenuMiCuentaComponent, VisionGeneralComponent, DatosPersonalesComponent, CambiarContraseniaComponent, PedidosRealizadosComponent, DetallePedidoRealizadoComponent],
  imports: [
    CommonModule,
    MiCuentaRoutingModule,
    FormsModule,
    NgbModule
  ]
})
export class MiCuentaModule { }
