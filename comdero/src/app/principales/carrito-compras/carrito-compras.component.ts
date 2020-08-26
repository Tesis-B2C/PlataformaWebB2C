import { Component, OnInit } from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {CarritoServicio} from "../../servicios/carrito.servicio";

@Component({
  selector: 'app-carrito-compras',
  templateUrl: './carrito-compras.component.html',
  styleUrls: ['./carrito-compras.component.css']
})
export class CarritoComprasComponent implements OnInit {
 public cont:Number;
 public carritoIdentidad;
  constructor(private  _agenteServicio:AgenteServicio, private _carritoServicio:CarritoServicio  ) { }

  async ngOnInit() {
    this.cont=1;
    let identidad = this._agenteServicio.getIdentity();
    try {
      if(identidad){
        this.carritoIdentidad = await this._carritoServicio.getCarrito(identidad.COD_AGENTE).toPromise();
        console.log("carrito", this.carritoIdentidad.data);
      }
    }catch (e) {
      console.log(e);
    }
  }

}
