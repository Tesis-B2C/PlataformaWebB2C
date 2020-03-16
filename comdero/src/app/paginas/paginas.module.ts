import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoguinComponent } from './loguin/loguin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { RegistroTiendaComponent } from './registro-tienda/registro-tienda.component';
import { FormsModule} from "@angular/forms";
import { OlvidoContraseniaComponent } from './olvido-contrasenia/olvido-contrasenia.component';
import { OlvidoContraseniaPaso2Component } from './olvido-contrasenia-paso2/olvido-contrasenia-paso2.component';

import { ArchwizardModule } from 'angular-archwizard';

@NgModule({
  declarations: [LoguinComponent, PrincipalComponent, RegistroComponent, RegistroTiendaComponent, OlvidoContraseniaComponent, OlvidoContraseniaPaso2Component],
    imports: [
      ArchwizardModule,
        CommonModule,
        NgbModule,
        FormsModule
    ],
  exports: [RegistroTiendaComponent]
})
export class PaginasModule { }
