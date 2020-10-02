import {BrowserModule} from '@angular/platform-browser';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PaginasModule} from './paginas/paginas.module';
import {PrincipalesModule} from './principales/principales.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DpaServicio} from "./servicios/dpa.servicio";
import {UnidadMedidaServicio} from "./servicios/unidad_medida.servicio";
import {AgenteServicio} from "./servicios/agente.servicio";
import {TiendaServicio} from "./servicios/tienda.servicio";
import {CategoriaServicio} from "./servicios/categoria.servicio";
import {ProductoServicio} from "./servicios/producto.servicio";
import {MetodoPagoServicio} from "./servicios/metodo_pago.servicio";
import {CorreoServicio} from "./servicios/correo.servicio";
import {CarritoServicio} from "./servicios/carrito.servicio";
import {CompraServicio} from "./servicios/compra.servicio";
import {ValoracionServicio} from "./servicios/valoracion.servicio";
import {EstadisticasServicio} from "./servicios/estadisticas.servicio";
import {AdministradorTiendaModule} from "./administrador-tienda/administrador-tienda.module";

/*import {GestionarTiendasModule} from "./administrador-tienda/gestionar-tiendas/gestionar-tiendas.module";*/
import {FormsModule} from "@angular/forms";
import {ArchwizardModule} from 'angular-archwizard';
import {ToastrModule} from 'ngx-toastr';
import {MetodoEnvioServicio} from "./servicios/metodo_envio.servicio";
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DescuentoServicio} from "./servicios/descuento.servicio";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TypeaheadModule} from 'ngx-bootstrap/typeahead';
import {ReloadGuard} from "./shared/guards/reload.guard";
import {ExcelServicio} from "./servicios/excel.servicio";

import {InterceptorsService} from './servicios/interceptors/interceptors.service';

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
    NgbModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    CarouselModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  providers: [
    DescuentoServicio,
    DpaServicio,
    AgenteServicio,
    CategoriaServicio,
    UnidadMedidaServicio,
    ProductoServicio,
    MetodoPagoServicio,
    MetodoEnvioServicio,
    TiendaServicio,
    CorreoServicio,
    CarritoServicio,
    CompraServicio,
    ValoracionServicio,
    ReloadGuard,
    ExcelServicio,
    EstadisticasServicio,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorsService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
