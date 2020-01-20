import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'
import {PrincipalComponent} from "./paginas/principal/principal.component";
import { RegistroComponent } from './paginas/registro/registro.component';

const routes: Routes = [
  {path: 'loguin', component: LoguinComponent},
  {path:'principal', component:PrincipalComponent},
  {path: 'registro', component: RegistroComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
