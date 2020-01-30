import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'
import {PrincipalComponent} from "./paginas/principal/principal.component";
import { RegistroComponent } from './paginas/registro/registro.component';
import { RegistroTiendaComponent } from './paginas/registro-tienda/registro-tienda.component';

const routes: Routes = [
  {path: 'loguin', component: LoguinComponent},
  {path:'principal', component:PrincipalComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'registro-tienda', component: RegistroTiendaComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
