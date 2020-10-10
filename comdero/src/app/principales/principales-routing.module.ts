import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {PrincipalComponent} from "./principal/principal.component";
import {CategoriasComponent} from "./categorias/categorias.component";
import {BusquedaComponent} from "./busqueda/busqueda.component";
import {DetalleProductoComponent} from "./detalle-producto/detalle-producto.component";
import {CarritoComprasComponent} from "./carrito-compras/carrito-compras.component";
import {AuthGuard} from "../shared/guards/auth.guard";
import {BusquedaCategoriaComponent} from "./busqueda-categoria/busqueda-categoria.component";
import {NotificacionesComponent} from "./notificaciones/notificaciones.component";

const routes: Routes = [
  {
    path: 'menu', component: MenuComponent,
    children: [
      {path: 'principal', component: PrincipalComponent},
      {path: 'categorias', component: CategoriasComponent},
      {path: 'busqueda/:palabraBuscada', component: BusquedaComponent},
      {path: 'busqueda-categoria/:categoria/:nombre', component: BusquedaCategoriaComponent},
      {path: 'detalle-producto/:idProducto', component: DetalleProductoComponent},
      {path: 'carrito-compras/:idUsuario', component: CarritoComprasComponent,canActivate:[AuthGuard]},
      {path: 'notificaciones', component: NotificacionesComponent,canActivate:[AuthGuard]},
      {path: 'detalle-tienda', loadChildren:'./detalle-tienda/detalle-tienda.module#DetalleTiendaModule'},

      {path: 'mi-cuenta', loadChildren: './mi-cuenta/mi-cuenta.module#MiCuentaModule',canActivate:[AuthGuard]}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalesRoutingModule {
}
