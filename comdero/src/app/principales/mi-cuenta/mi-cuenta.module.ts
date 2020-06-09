import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiCuentaRoutingModule } from './mi-cuenta-routing.module';
import { MenuMiCuentaComponent } from './menu-mi-cuenta/menu-mi-cuenta.component';
import { VisionGeneralComponent } from './vision-general/vision-general.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import {FormsModule} from "@angular/forms";

import { CambiarContraseniaComponent } from './cambiar-contrasenia/cambiar-contrasenia.component';


@NgModule({
  declarations: [MenuMiCuentaComponent, VisionGeneralComponent, DatosPersonalesComponent, CambiarContraseniaComponent],
  imports: [
    CommonModule,
    MiCuentaRoutingModule,
    FormsModule
  ]
})
export class MiCuentaModule { }
