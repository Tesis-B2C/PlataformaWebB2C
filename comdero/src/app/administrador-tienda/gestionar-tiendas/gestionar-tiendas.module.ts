import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionarTiendasRoutingModule } from './gestionar-tiendas-routing.module';

import { SidebarModule } from 'ng-sidebar';
import { MenuGestionTiendasComponent } from './menu-gestion-tiendas/menu-gestion-tiendas.component';
import { ProductosComponent } from './productos/productos.component';
import { NgxEditorModule } from 'ngx-editor';

import {FormsModule} from "@angular/forms";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ MenuGestionTiendasComponent, ProductosComponent],
  imports: [
    CommonModule,
    SidebarModule,
    NgxEditorModule,
    NgbModule,
    FormsModule,
    GestionarTiendasRoutingModule
  ]
})
export class GestionarTiendasModule { }
