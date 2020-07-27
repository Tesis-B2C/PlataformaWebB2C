import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {PrincipalComponent} from "./principal/principal.component";
import {CategoriasComponent} from "./categorias/categorias.component";
import {DetalleTiendaComponent} from "./detalle-tienda/detalle-tienda.component";


const routes: Routes = [

  {path:'menu', component:MenuComponent,
  children: [
  { path: 'principal', component: PrincipalComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'detalle-tienda', component: DetalleTiendaComponent },
    {path: 'mi-cuenta', loadChildren:'./mi-cuenta/mi-cuenta.module#MiCuentaModule'}
    ]},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalesRoutingModule { }
