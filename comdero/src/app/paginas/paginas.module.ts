import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoguinComponent } from './loguin/loguin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PrincipalComponent } from './principal/principal.component';
import { RegistroComponent } from './registro/registro.component';
import { FormsModule} from "@angular/forms";


@NgModule({
  declarations: [LoguinComponent, PrincipalComponent, RegistroComponent],
    imports: [
        CommonModule,
        NgbModule,
        FormsModule,

    ]
})
export class PaginasModule { }
