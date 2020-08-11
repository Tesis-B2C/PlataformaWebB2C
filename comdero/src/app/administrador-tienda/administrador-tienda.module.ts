import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorTiendaRoutingModule } from './administrador-tienda-routing.module';
import { TiendasComponent } from './tiendas/tiendas.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { SidebarModule } from 'ng-sidebar';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
/*import {NgbButtonsModule} from "@ng-bootstrap/ng-bootstrap";*/

@NgModule({
  declarations: [TiendasComponent, EncabezadoComponent,],
    imports: [
        CommonModule,
        AdministradorTiendaRoutingModule,
        SidebarModule,
        NgbModule,
      NgxSpinnerModule

        /* NgbButtonsModule,*/

    ]
})
export class AdministradorTiendaModule { }
