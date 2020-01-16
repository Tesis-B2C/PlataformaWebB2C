import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoguinComponent } from './loguin/loguin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';


@NgModule({
  declarations: [LoguinComponent, PrincipalComponent, RegistroComponent],
  imports: [
    CommonModule,
    NgbModule
  ]
})
export class PaginasModule { }
