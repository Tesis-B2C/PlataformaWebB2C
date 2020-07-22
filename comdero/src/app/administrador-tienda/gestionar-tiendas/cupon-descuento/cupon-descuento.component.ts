import {Component, OnInit, DoCheck} from '@angular/core';

import {Descuento} from "../../../modelos/descuento";
import {defineLocale} from 'ngx-bootstrap/chronos';
import {esLocale} from 'ngx-bootstrap/locale';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ProductoServicio} from "../../../servicios/producto.servicio";

defineLocale('es', esLocale);

@Component({
  selector: 'app-cupon-descuento',
  templateUrl: './cupon-descuento.component.html',
  styleUrls: ['./cupon-descuento.component.css'],
  providers: [DatePipe]
})
export class CuponDescuentoComponent implements OnInit {
  public Descuento: Descuento
  public banderaValidaciones: boolean = false;
  public bsRangeValue;
  public banderaOpcionAplicarA: boolean = true;
  public page = 1;
  public pageSize = 10;
  public busqueda;

  constructor(private modalService: NgbModal, private cp: DatePipe, private _productoServicio: ProductoServicio) {
    this.Descuento = new Descuento(null, null, null, null);


  }

  search(text: string): any[] {
    return this.misProductos.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente
    });
  }

  public identidadTienda;
  public misProductos;
  public result = [];

  async ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misProductos = response.data;
    debugger;
    this.result = this.misProductos;
    console.log("mis productos", this.misProductos);
  }


  async busquedasasd() {
    this.result = await this.search(this.busqueda);
  }

  hola() {

    console.log("asdasd", this.bsRangeValue);
    let sdasd = this.bsRangeValue[0].toJSON();
    console.log("asdasd", this.cp.transform(sdasd, 'yyyy-mm-dd'))
  }

  opcionAplicarA(value) {
    this.banderaOpcionAplicarA = value;
  }


  public abrirModalVideoYoutube(content) {
    this.modalService.open(content, {centered: true, size: 'm',scrollable: true});
  }

}
