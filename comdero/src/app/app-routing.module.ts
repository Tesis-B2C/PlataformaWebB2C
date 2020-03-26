import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'

import { RegistroComponent } from './paginas/registro/registro.component';
import { RegistroTiendaComponent } from './paginas/registro-tienda/registro-tienda.component';
import {OlvidoContraseniaComponent} from './paginas/olvido-contrasenia/olvido-contrasenia.component';
import { OlvidoContraseniaPaso2Component } from './paginas/olvido-contrasenia-paso2/olvido-contrasenia-paso2.component';

const routes: Routes = [
  {path: '', loadChildren:'./principales/principales.module#PrincipalesModule'},
  {path: '', loadChildren:'./administrador-tienda/administrador-tienda.module#AdministradorTiendaModule'},
  {path: 'loguin/:token', component: LoguinComponent},
  {path: 'loguin', component: LoguinComponent},
 // {path:'principal', component:PrincipalComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'registro-tienda', component: RegistroTiendaComponent},
  {path: 'olvido-contrasenia', component: OlvidoContraseniaComponent},
  {path: 'olvido-contrasenia-paso2/:token', component: OlvidoContraseniaPaso2Component},
  {path: '**', redirectTo: 'principal'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
