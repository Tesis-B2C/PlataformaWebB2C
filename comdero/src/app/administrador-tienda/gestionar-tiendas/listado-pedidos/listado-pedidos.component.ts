import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";

@Component({
  selector: 'app-listado-pedidos',
  templateUrl: './listado-pedidos.component.html',
  styleUrls: ['./listado-pedidos.component.css']
})
export class ListadoPedidosComponent implements OnInit {


  public page = 1;
  public pageSize = 3;
  public result = [];
  public estadoActivo = 0;
  public fechaActiva = 1;
  public misPedidos;
  public identidadTienda;

  constructor(public _compraServicio: CompraServicio) {
  }

  async ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    await this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  estado(estado) {
    this.page = 1;
    this.estadoActivo = estado;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  fecha(fecha) {
    this.page = 1;
    this.fechaActiva = fecha;
    this.getMisCompras(this.estadoActivo, this.fechaActiva);
  }

  public async getMisCompras(estado, fecha) {
    this.misPedidos = null;
    this.result = [];

    try {
      let response = await this._compraServicio.getMisPedidos(estado, fecha,this.identidadTienda.NUM_TIENDA).toPromise();
      this.misPedidos = response.data;
      console.log("PEDIDOS obtenidas", this.misPedidos);
      this.result = this.misPedidos;
      for (let compra of this.misPedidos) {
        let total_final = 0;
        let productos = 0;
        let impuestos = 0;
        let subtotal = 0;
        let descuento = 0;
        let cupon = 0;
        let peso=0;


        for (let producto of compra.COMPRA_PRODUCTOs) {
          total_final = total_final + producto.SUBTOTAL - producto.DESCUENTOS - producto.CUPON;
          productos = productos + producto.TOTAL_PRODUCTOS;
          impuestos = impuestos + producto.IMPUESTOS;
          subtotal = subtotal + producto.SUBTOTAL;
          descuento = descuento + producto.DESCUENTOS;
          cupon = cupon + producto.CUPON;
          peso=peso+producto.VARIANTE.PRODUCTO.PESO_PRODUCTO;
        }
        compra.productos
        compra.total_final = total_final + compra.COSTO_ENVIO + compra.RECARGO_PAYPAL;
        compra.productos = productos;
        compra.impuestos = impuestos;
        compra.subtotal = subtotal;
        compra.descuento = descuento;
        compra.cupon = cupon;
        compra.peso=peso;
      }
    } catch (e) {
      console.log("error", e)

    }
  }

}
