import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";
import {element} from "protractor";
import objectContaining = jasmine.objectContaining;

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {
  public cont: Number;
  public carritoIdentidad;
  public vTiendas = new Set();

  constructor(private  _agenteServicio: AgenteServicio, private _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {
    this.cont = 1;
    this.iniciarCarritoCompras();
  }

  obj = {
    idTienda: null,
    producto: null
  }

  public async iniciarCarritoCompras() {
    let identidad = this._agenteServicio.getIdentity();
    try {
      if (identidad) {
        this.carritoIdentidad = await this._carritoServicio.getCarrito(identidad.COD_AGENTE).toPromise();

        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          this.obj = {
            idTienda: null,
            producto: []
          }
          this.obj.idTienda = element.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA;
          this.vTiendas.add(this.obj)
        });
        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          this.vTiendas.forEach(element2 => {
            if (element.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2['idTienda']) {
              element2['producto'].push(element);
            }
          })

        });
     

        console.log("por tienda", this.vTiendas);

      }
    } catch (e) {
      console.log(e);
    }
  }
}
