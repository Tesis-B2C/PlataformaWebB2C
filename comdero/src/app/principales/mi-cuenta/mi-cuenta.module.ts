import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiCuentaRoutingModule } from './mi-cuenta-routing.module';
import { MenuMiCuentaComponent } from './menu-mi-cuenta/menu-mi-cuenta.component';
import { VisionGeneralComponent } from './vision-general/vision-general.component';


@NgModule({
  declarations: [MenuMiCuentaComponent, VisionGeneralComponent],
  imports: [
    CommonModule,
    MiCuentaRoutingModule
  ]
})
export class MiCuentaModule { }
