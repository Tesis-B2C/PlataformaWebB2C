import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css']
})
export class PedidosRealizadosComponent implements OnInit {
  public comprasObtenidas;
  public noExite;
  public error;

  public page = 1;
  public pageSize = 3;
  public result = [];
  public estadoActivo = 0;
  public fechaActiva = 1;

  constructor(public _compraServicio: CompraServicio) {
  }

  async ngOnInit() {
    await this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  estado(estado) {
    this.page=1;
    this.estadoActivo = estado;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  fecha(fecha) {
    this.page =1;
    this.fechaActiva = fecha;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  public async getMisCompras(estado, fecha) {
    this.comprasObtenidas = null;
    this.result = [];
    this.error = null;
    try {
      let response = await this._compraServicio.getMisCompras(estado, fecha).toPromise();
      this.comprasObtenidas = response.data;
      console.log("comra obtenidas", this.comprasObtenidas);
      this.result = this.comprasObtenidas;
      for (let compra of this.comprasObtenidas) {
        let total_final = 0;
        let productos = 0;
        let impuestos = 0;
        let subtotal = 0;
        let descuento = 0;
        let cupon = 0;


        for (let producto of compra.COMPRA_PRODUCTOs) {
          total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
          productos = productos + producto.TOTAL_PRODUCTOS;
          impuestos = impuestos + producto.IMPUESTOS;
          subtotal = subtotal + producto.SUBTOTAL;
          descuento = descuento + producto.DESCUENTOS;
          cupon = cupon + producto.CUPON;

        }
        compra.productos
        compra.total_final = total_final + compra.COSTO_ENVIO + compra.RECARGO_PAYPAL;
        compra.productos = productos;
        compra.impuestos = impuestos;
        compra.subtotal = subtotal;
        compra.descuento = descuento;
        compra.cupon = cupon;
      }
    } catch (e) {
      console.log("error", e)
      this.error = e;
    }
  }

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

}
