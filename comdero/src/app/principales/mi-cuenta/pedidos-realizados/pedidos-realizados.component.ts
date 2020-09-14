import {Component, OnInit} from '@angular/core';
import {CompraServicio} from "../../../servicios/compra.servicio";

@Component({
  selector: 'app-pedidos-realizados',
  templateUrl: './pedidos-realizados.component.html',
  styleUrls: ['./pedidos-realizados.component.css']
})
export class PedidosRealizadosComponent implements OnInit {
  public comprasObtenidas;

  constructor(public _compraServicio: CompraServicio) {
  }

  async ngOnInit() {
    await this.getMisCompras();
  }

  public async getMisCompras() {
    try {
      let response = await this._compraServicio.getMisCompras().toPromise();
      this.comprasObtenidas= response.data;
    } catch (e) {
      console.log("error", e)
    }
  }

}
