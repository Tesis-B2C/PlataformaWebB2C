import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";


@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {
  public cont: number;
  public carritoIdentidad;
  public vTiendas = new Set();

  constructor(public  _agenteServicio: AgenteServicio, public _carritoServicio: CarritoServicio) {
  }

  async ngOnInit() {
    this.cont = 1;
    this.iniciarCarritoCompras();
  }

  public obj = {
    idTienda: null,
    producto_carrito: null
  }

  public async iniciarCarritoCompras() {

    try {
      let tiendas = new Set();
      this.carritoIdentidad = await this._carritoServicio.getCarrito().toPromise();

      this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {

        this.obj.idTienda = element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA;
        tiendas.add(element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA)
      });
      console.log("tiendas", tiendas);
      tiendas.forEach(element2 => {
        this.obj = {
          idTienda: null,
          producto_carrito: []
        }
        this.carritoIdentidad.data.CARRITO_PRODUCTOs.forEach(element => {
          console.log("tiendas", element2);
          if (element.VARIANTE.PRODUCTO.OFERTum.TIENDA.NUM_TIENDA == element2) {
            this.obj.idTienda = element2;
            this.obj.producto_carrito.push(element);
          }
        })
        this.vTiendas.add(this.obj);
      });


      console.log("por tienda", this.vTiendas);


    } catch (e) {
      console.log(e);
    }
  }
}
