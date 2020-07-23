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
  public banderaCuponDescuento: boolean = true;
  public vectorProductos = new Set();

  constructor(private modalService: NgbModal, private cp: DatePipe, private _productoServicio: ProductoServicio) {
    this.Descuento = new Descuento(null, null, null, null, null, null, null, 0);


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
    this.modalService.open(content, {centered: true, size: 'lg', scrollable: true});
  }

  public cambiarOpcionDescuento(value) {
    this.banderaCuponDescuento = value;
    this.Descuento.Motivo_Descuento = "";
    if (this.banderaCuponDescuento) {
      this.Descuento.Tipo_Descuento = "cupon";
    } else if (!this.banderaCuponDescuento) {
      this.Descuento.Tipo_Descuento = "automatico";
    }

  }

  public generarCodigDeswcuento() {
    this.Descuento.Motivo_Descuento = this.makeid(8);

  }

  public makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public agregarTodosProductos(event) {
    if (event.target.checked) {
      debugger
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i]);
      }
      console.log("vector productos", this.vectorProductos)


    } else {
      this.vectorProductos = new Set();
    }

  }


  public agregarProducto(event, cod) {
    if (event.target.checked) {
      debugger
      this.vectorProductos.add(cod);
      console.log("vector productos", this.vectorProductos)
    } else {
      this.vectorProductos.delete(cod);
    }
  }


  vectorProductosEnviar = []

  agregar() {
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {

      this.vectorProductosEnviar.push(producto);
    }
  }

  borrar(producto){
    this.vectorProductos.delete(producto)
    this.vectorProductosEnviar = [];
    for (let producto of this.vectorProductos) {

      this.vectorProductosEnviar.push(producto);
    }
  }


}
