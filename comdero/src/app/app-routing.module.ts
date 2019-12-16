import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'
import {PrincipalComponent} from "./paginas/principal/principal.component";

const routes: Routes = [
  {path: 'loguin', component: LoguinComponent},
  {path:'principal', component:PrincipalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
