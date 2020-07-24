import { Component, OnInit } from '@angular/core';
import {Producto} from "../../../modelos/producto";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import {DescuentoServicio} from "../../../servicios/descuento.servicio";

@Component({
  selector: 'app-listado-cupon-descuento',
  templateUrl: './listado-cupon-descuento.component.html',
  styleUrls: ['./listado-cupon-descuento.component.css']
})
export class ListadoCuponDescuentoComponent implements OnInit {

  public identidadTienda;
  misDescuentos;
  constructor(private _descuentoServicio:DescuentoServicio) { }

 async ngOnInit() {
    try{
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misDescuentos = response.data;
    debugger;
  /*  this.result = this.misProductos;
    console.log("mis productos", this.misProductos);*/
    }catch (e) {

    }
  }

}
