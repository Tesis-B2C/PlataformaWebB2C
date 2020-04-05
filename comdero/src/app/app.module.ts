import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PaginasModule} from './paginas/paginas.module';
import {PrincipalesModule} from './principales/principales.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DpaServicio} from "./servicios/dpa.servicio";
import {AgenteServicio} from "./servicios/agente.servicio";
import {AdministradorTiendaModule} from "./administrador-tienda/administrador-tienda.module";
import {GestionarTiendasModule} from "./administrador-tienda/gestionar-tiendas/gestionar-tiendas.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,




  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PaginasModule,
    PrincipalesModule,
    AdministradorTiendaModule,
    GestionarTiendasModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [DpaServicio,AgenteServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
