import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionarTiendasRoutingModule } from './gestionar-tiendas-routing.module';

import { SidebarModule } from 'ng-sidebar';
import { MenuGestionTiendasComponent } from './menu-gestion-tiendas/menu-gestion-tiendas.component';
@NgModule({
  declarations: [ MenuGestionTiendasComponent],
  imports: [
    CommonModule,
    SidebarModule,
    GestionarTiendasRoutingModule
  ]
})
export class GestionarTiendasModule { }
