import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PaginasModule} from './paginas/paginas.module';
import {PrincipalesModule} from './principales/principales.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DpaServicio} from "./servicios/dpa.servicio";
import {UnidadMedidaServicio} from "./servicios/unidad_medida.servicio";
import {AgenteServicio} from "./servicios/agente.servicio";
import {CategoriaServicio} from "./servicios/categoria.servicio";
import {ProductoServicio} from "./servicios/producto.servicio";
import {MetodoPagoServicio} from "./servicios/metodo_pago.servicio";
import {AdministradorTiendaModule} from "./administrador-tienda/administrador-tienda.module";
import {GestionarTiendasModule} from "./administrador-tienda/gestionar-tiendas/gestionar-tiendas.module";
import {FormsModule} from "@angular/forms";

import { ArchwizardModule } from 'angular-archwizard';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ArchwizardModule,
    BrowserModule,
    AppRoutingModule,
    PaginasModule,
    PrincipalesModule,
    AdministradorTiendaModule,
    GestionarTiendasModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({preventDuplicates:true})
  ],
  providers: [DpaServicio,AgenteServicio,CategoriaServicio,UnidadMedidaServicio,ProductoServicio,MetodoPagoServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
