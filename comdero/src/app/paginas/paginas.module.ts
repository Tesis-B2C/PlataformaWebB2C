import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoguinComponent } from './loguin/loguin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RegistroComponent } from './registro/registro.component';
import { RegistroTiendaComponent } from './registro-tienda/registro-tienda.component';
import { FormsModule} from "@angular/forms";
import { OlvidoContraseniaComponent } from './olvido-contrasenia/olvido-contrasenia.component';
import { OlvidoContraseniaPaso2Component } from './olvido-contrasenia-paso2/olvido-contrasenia-paso2.component';

import { ArchwizardModule } from 'angular-archwizard';
import { NgxEditorModule } from 'ngx-editor';
import {RouterModule} from "@angular/router";
import { NgxPayPalModule } from 'ngx-paypal';
import { Error500Component } from './error500/error500.component';
@NgModule({
  declarations: [
    LoguinComponent,
    RegistroComponent,
    RegistroTiendaComponent,
    OlvidoContraseniaComponent,
    OlvidoContraseniaPaso2Component,
    Error500Component
  ],
    imports: [
        ArchwizardModule,
        NgxEditorModule,
        CommonModule,
        NgbModule,
        FormsModule,
        RouterModule,
       NgxPayPalModule


    ],
  exports: [RegistroTiendaComponent]
})
export class PaginasModule { }
