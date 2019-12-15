import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoguinComponent} from './paginas/loguin/loguin.component'

const routes: Routes = [
  {path: 'loguin', component: LoguinComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
