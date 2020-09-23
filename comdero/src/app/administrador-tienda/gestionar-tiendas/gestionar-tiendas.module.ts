import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GestionarTiendasRoutingModule} from './gestionar-tiendas-routing.module';

import {SidebarModule} from 'ng-sidebar';
import {MenuGestionTiendasComponent} from './menu-gestion-tiendas/menu-gestion-tiendas.component';
import {ProductosComponent} from './productos/productos.component';
import {NgxEditorModule} from 'ngx-editor';
import {FormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ColorPickerModule} from 'ngx-color-picker';
import {MetodosPagoComponent} from './metodos-pago/metodos-pago.component';
import {GeneralTiendaComponent} from './general-tienda/general-tienda.component';
import {SucursalesTiendaComponent} from './sucursales-tienda/sucursales-tienda.component';
import {PersonalizacionTiendaComponent} from './personalizacion-tienda/personalizacion-tienda.component';
import {MetodosEnvioComponent} from './metodos-envio/metodos-envio.component';
import {InicioAdministracionComponent} from './inicio-administracion/inicio-administracion.component';
import {ListadoProductosComponent} from './listado-productos/listado-productos.component';

import { ModificarProductoComponent } from './modificar-producto/modificar-producto.component';
import { CuponDescuentoComponent } from './cupon-descuento/cupon-descuento.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ListadoCuponDescuentoComponent } from './listado-cupon-descuento/listado-cupon-descuento.component';
import { ModificarCuponDescuentoComponent } from './modificar-cupon-descuento/modificar-cupon-descuento.component';
import { ListadoPedidosComponent } from './listado-pedidos/listado-pedidos.component';
import { GestionarPedidoComponent } from './gestionar-pedido/gestionar-pedido.component';
import { ListadoClientesComponent } from './listado-clientes/listado-clientes.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [MenuGestionTiendasComponent, ProductosComponent, MetodosPagoComponent, GeneralTiendaComponent, SucursalesTiendaComponent, PersonalizacionTiendaComponent, MetodosEnvioComponent, InicioAdministracionComponent, ListadoProductosComponent, ModificarProductoComponent, CuponDescuentoComponent, ListadoCuponDescuentoComponent, ModificarCuponDescuentoComponent, ListadoPedidosComponent, GestionarPedidoComponent, ListadoClientesComponent, EstadisticasComponent],

  imports: [
    CommonModule,
    SidebarModule,
    NgxEditorModule,
    NgbModule,
    FormsModule,
    GestionarTiendasRoutingModule,
    ColorPickerModule,
    BsDatepickerModule,
    ChartsModule
  ]
})
export class GestionarTiendasModule {
}
