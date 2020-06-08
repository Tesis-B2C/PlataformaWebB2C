import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {PrincipalComponent} from "./principal/principal.component";
import {CategoriasComponent} from "./categorias/categorias.component";
import {MiCuentaComponent} from "./mi-cuenta/mi-cuenta.component";

const routes: Routes = [

  {path:'menu', component:MenuComponent,
  children: [
  { path: 'principal', component: PrincipalComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'mi-cuenta', component: MiCuentaComponent }]},

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalesRoutingModule { }
