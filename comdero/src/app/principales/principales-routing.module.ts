import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {PrincipalComponent} from "./principal/principal.component";
import {CategoriasComponent} from "./categorias/categorias.component";
import {BusquedaComponent} from "./busqueda/busqueda.component";
import {AuthGuard} from "../shared/guards/auth.guard";


const routes: Routes = [
  {
    path: 'menu', component: MenuComponent,
    children: [
      {path: 'principal', component: PrincipalComponent},
      {path: 'categorias', component: CategoriasComponent},
      {path: 'busqueda/:palabraBuscada', component: BusquedaComponent},
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
