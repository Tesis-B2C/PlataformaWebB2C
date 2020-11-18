import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'

import { RegistroComponent } from './paginas/registro/registro.component';
import { RegistroTiendaComponent } from './paginas/registro-tienda/registro-tienda.component';
import {OlvidoContraseniaComponent} from './paginas/olvido-contrasenia/olvido-contrasenia.component';
import { OlvidoContraseniaPaso2Component } from './paginas/olvido-contrasenia-paso2/olvido-contrasenia-paso2.component';
import {AuthGuard} from "./shared/guards/auth.guard";
import {Error500Component} from "./paginas/error500/error500.component";
import {Error404Component} from "./paginas/error404/error404.component";
import {Error0Component} from "./paginas/error0/error0.component";

const routes: Routes = [

  {path: 'principales', loadChildren:'./principales/principales.module#PrincipalesModule'},
  {path: 'administrador', loadChildren:'./administrador-tienda/administrador-tienda.module#AdministradorTiendaModule',canActivate:[AuthGuard]},
  {path: 'login/:token', component: LoguinComponent},
  {path: 'login', component: LoguinComponent},
 // {path:'principal', component:PrincipalComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'registro-tienda', component: RegistroTiendaComponent,canActivate:[AuthGuard]},
  {path: 'olvido-contrasenia', component: OlvidoContraseniaComponent},
  {path: 'olvido-contrasenia-paso2/:token', component: OlvidoContraseniaPaso2Component},
  {path: 'error500', component: Error500Component},
  {path: 'error404', component: Error404Component},
  {path: 'error0', component: Error0Component},
  {path: '**', redirectTo: 'principales/menu/principal'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
