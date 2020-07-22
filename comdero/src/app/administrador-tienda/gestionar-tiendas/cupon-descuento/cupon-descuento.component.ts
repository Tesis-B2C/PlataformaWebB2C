import {Component, OnInit, DoCheck} from '@angular/core';

import {Descuento} from "../../../modelos/descuento";
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import {CurrencyPipe, DatePipe} from "@angular/common";
defineLocale('es', esLocale);
@Component({
  selector: 'app-cupon-descuento',
  templateUrl: './cupon-descuento.component.html',
  styleUrls: ['./cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class CuponDescuentoComponent implements OnInit {
  Descuento: Descuento
  banderaValidaciones: boolean = false;
  bsRangeValue;

  constructor(private cp: DatePipe) {
    this.Descuento = new Descuento(null, null, null, null);


  }

  ngOnInit() {


  }

  hola(){

    console.log("asdasd", this.bsRangeValue);
    let sdasd = this.bsRangeValue[0].toJSON();
    console.log("asdasd",this.cp.transform(sdasd, 'yyyy-mm-dd'))
  }


}
