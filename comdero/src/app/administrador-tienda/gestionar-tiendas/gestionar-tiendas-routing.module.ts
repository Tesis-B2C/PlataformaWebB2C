import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuGestionTiendasComponent} from "./menu-gestion-tiendas/menu-gestion-tiendas.component";
import {ProductosComponent} from "./productos/productos.component";
import {MetodosPagoComponent} from "./metodos-pago/metodos-pago.component";
import {PersonalizacionTiendaComponent} from "./personalizacion-tienda/personalizacion-tienda.component";
import {MetodosEnvioComponent} from "./metodos-envio/metodos-envio.component";
import {GeneralTiendaComponent} from "./general-tienda/general-tienda.component";
import {SucursalesTiendaComponent} from "./sucursales-tienda/sucursales-tienda.component";
import {InicioAdministracionComponent} from "./inicio-administracion/inicio-administracion.component";
import {ListadoProductosComponent} from "./listado-productos/listado-productos.component";
import {ModificarProductoComponent} from "./modificar-producto/modificar-producto.component";
import {CuponDescuentoComponent} from "./cupon-descuento/cupon-descuento.component";
import {ListadoCuponDescuentoComponent} from "./listado-cupon-descuento/listado-cupon-descuento.component";
import {ModificarCuponDescuentoComponent} from "./modificar-cupon-descuento/modificar-cupon-descuento.component";
import {ReloadGuard} from "../../shared/guards/reload.guard";
import {ListadoPedidosComponent} from "./listado-pedidos/listado-pedidos.component";
import {GestionarPedidoComponent} from "./gestionar-pedido/gestionar-pedido.component";
const routes: Routes = [
  {
    path: 'menu-gestion-tienda', component: MenuGestionTiendasComponent,
    children: [
      { path: 'productos', component: ProductosComponent,canDeactivate:[ReloadGuard] },
      { path: 'listado-productos', component: ListadoProductosComponent },
      { path: 'modificar-producto/:id', component: ModificarProductoComponent },
      { path: 'metodos-pago', component: MetodosPagoComponent },
      { path: 'metodos-envio', component: MetodosEnvioComponent },
      { path: 'general-tienda', component: GeneralTiendaComponent },
      { path: 'sucursales-tienda', component: SucursalesTiendaComponent },
      { path: 'personalizacion-tienda', component: PersonalizacionTiendaComponent },
      {path: 'inicio-administracion', component: InicioAdministracionComponent},
      {path: 'cupon-descuento', component: CuponDescuentoComponent},
      {path: 'listado-cupon-descuento', component: ListadoCuponDescuentoComponent},
      {path: 'modificar-cupon-descuento/:id', component: ModificarCuponDescuentoComponent},
      {path: 'listado-pedidos', component: ListadoPedidosComponent},
      {path: 'gestionar-pedido/:id', component: GestionarPedidoComponent}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionarTiendasRoutingModule {
}
