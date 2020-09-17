import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CompraServicio} from "../../../servicios/compra.servicio";
import {GLOBAL} from "../../../servicios/global";

@Component({
  selector: 'app-gestionar-pedido',
  templateUrl: './gestionar-pedido.component.html',
  styleUrls: ['./gestionar-pedido.component.css']
})
export class GestionarPedidoComponent implements OnInit {
  public idPedido;
  public compra;

  constructor(public _compraServicio: CompraServicio, public router: Router, public route: ActivatedRoute) {
  }

  async ngOnInit() {
    await this.getPedido();

  }

  async getPedido() {
    this.idPedido = this.route.snapshot.params.id;
    try {
      let response = await this._compraServicio.getPedido(this.idPedido).toPromise();
      this.compra = response.data;
      let total_final = 0;
      let productos = 0;
      let impuestos = 0;
      let subtotal = 0;
      let descuento = 0;
      let cupon = 0;


      for (let producto of this.compra.COMPRA_PRODUCTOs) {
        total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
        productos = productos + producto.TOTAL_PRODUCTOS;
        impuestos = impuestos + producto.IMPUESTOS;
        subtotal = subtotal + producto.SUBTOTAL;
        descuento = descuento + producto.DESCUENTOS;
        cupon = cupon + producto.CUPON;

      }
      this.compra.productos
      this.compra.total_final = total_final + this.compra.COSTO_ENVIO + this.compra.RECARGO_PAYPAL;
      this.compra.productos = productos;
      this.compra.impuestos = impuestos;
      this.compra.subtotal = subtotal;
      this.compra.descuento = descuento;
      this.compra.cupon = cupon;
    } catch (e) {

    }
  }

  public noExite;

  getImagen(pathImagen) {
    this.noExite = 'assets/images/no-image.png';
    if (pathImagen) {
      this.noExite = GLOBAL.urlImagen + pathImagen;
    }
    return this.noExite;
  }

}
