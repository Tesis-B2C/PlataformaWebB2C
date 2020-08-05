import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PrincipalesRoutingModule} from './principales-routing.module';
import {PrincipalComponent} from "./principal/principal.component";
import {MenuComponent} from "./menu/menu.component";
import {CategoriasComponent} from './categorias/categorias.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {FormsModule} from "@angular/forms";
import {BusquedaComponent} from './busqueda/busqueda.component';

@NgModule({
  declarations: [
    PrincipalComponent,
    MenuComponent,
    CategoriasComponent,
    BusquedaComponent
  ],
  imports: [
    CommonModule,
    PrincipalesRoutingModule,
    NgbModule,
    CarouselModule,
    FormsModule
  ]
})
export class PrincipalesModule {
}
