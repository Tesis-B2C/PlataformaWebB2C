import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoguinComponent } from './loguin/loguin.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [LoguinComponent],
  imports: [
    CommonModule,
    NgbModule
  ]
})
export class PaginasModule { }
