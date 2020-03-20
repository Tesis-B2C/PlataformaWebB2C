import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";
import {PrincipalComponent} from "./principal/principal.component";


const routes: Routes = [
  {path:'menu', component:MenuComponent,
  children: [
  { path: 'principal', component: PrincipalComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalesRoutingModule { }
