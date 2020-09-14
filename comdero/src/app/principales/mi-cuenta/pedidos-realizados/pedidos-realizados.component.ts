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

  constructor(public _compraServicio: CompraServicio) {
  }

  async ngOnInit() {
    await this.getMisCompras();
  }

  public async getMisCompras() {
    try {
      let response = await this._compraServicio.getMisCompras().toPromise();
      this.comprasObtenidas = response.data;
      console.log("comra obtenidas", this.comprasObtenidas);
      for (let compra of this.comprasObtenidas) {
        let suma=0;
        for (let producto of compra.COMPRA_PRODUCTOs) {
            suma=suma+producto.SUBTOTAL-producto.DESCUENTOS-producto.CUPON;
        }
        compra.total_final=suma+compra.COSTO_ENVIO+compra.RECARGO_PAYPAL;

      }
    } catch (e) {
      console.log("error", e)
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
