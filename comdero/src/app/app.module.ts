import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PaginasModule} from './paginas/paginas.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DpaServicio} from "./servicios/dpa.servicio";
import {AgenteServicio} from "./servicios/agente.servicio";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PaginasModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [DpaServicio,AgenteServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
