import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrincipalesRoutingModule } from './principales-routing.module';
import {PrincipalComponent} from "./principal/principal.component";
import {MenuComponent} from "./menu/menu.component";
import { CategoriasComponent } from './categorias/categorias.component';
import { DetalleTiendaComponent } from './detalle-tienda/detalle-tienda.component';

@NgModule({
  declarations: [PrincipalComponent,MenuComponent, CategoriasComponent, DetalleTiendaComponent],
  imports: [
    CommonModule,
    PrincipalesRoutingModule,
    NgbModule
  ]
})
export class PrincipalesModule { }
