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
import {TypeaheadModule} from "ngx-bootstrap";
import {DetalleProductoComponent} from './detalle-producto/detalle-producto.component';
import {HttpClientModule} from '@angular/common/http';
import {CarritoComprasComponent} from './carrito-compras/carrito-compras.component';
import {NgxPayPalModule} from 'ngx-paypal';
import {BusquedaCategoriaComponent} from './busqueda-categoria/busqueda-categoria.component';


// for Core import:

@NgModule({
  declarations: [
    PrincipalComponent,
    MenuComponent,
    CategoriasComponent,
    BusquedaComponent,
    DetalleProductoComponent,
    CarritoComprasComponent,
    BusquedaCategoriaComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    PrincipalesRoutingModule,
    NgbModule,
    CarouselModule,
    FormsModule,
    TypeaheadModule,
    NgxPayPalModule,

  ]
})
export class PrincipalesModule {





}
