import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionarTiendasRoutingModule } from './gestionar-tiendas-routing.module';

import { SidebarModule } from 'ng-sidebar';
import { MenuGestionTiendasComponent } from './menu-gestion-tiendas/menu-gestion-tiendas.component';
import { ProductosComponent } from './productos/productos.component';
import { NgxEditorModule } from 'ngx-editor';
import { FormsModule } from "@angular/forms";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { MetodosPagoComponent } from './metodos-pago/metodos-pago.component';
import { MetodosEnvioTComponent } from './metodos-envioT/metodos-envioT.component';
import { GeneralTiendaComponent } from './general-tienda/general-tienda.component';
import { SucursalesTiendaComponent } from './sucursales-tienda/sucursales-tienda.component';
import { PersonalizacionTiendaComponent } from './personalizacion-tienda/personalizacion-tienda.component';
import { MetodosEnvioComponent } from './metodos-envio/metodos-envio.component';
import { InicioAdministracionComponent } from './inicio-administracion/inicio-administracion.component';

@NgModule({
  declarations: [MenuGestionTiendasComponent, ProductosComponent, MetodosPagoComponent, MetodosEnvioTComponent, GeneralTiendaComponent, SucursalesTiendaComponent, PersonalizacionTiendaComponent, MetodosEnvioComponent, InicioAdministracionComponent],

  imports: [
    CommonModule,
    SidebarModule,
    NgxEditorModule,
    NgbModule,
    FormsModule,
    GestionarTiendasRoutingModule,
    ColorPickerModule,

  ]
})
export class GestionarTiendasModule { }
