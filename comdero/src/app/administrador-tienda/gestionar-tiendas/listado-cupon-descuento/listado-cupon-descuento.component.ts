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
  public misDescuentos;
  public busqueda;

  public page = 1;
  public pageSize = 10;
  public vectorDescuentos= new Set();
  public result = [];
  constructor(private _descuentoServicio:DescuentoServicio) { }

 async ngOnInit() {
    try{
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._descuentoServicio.getMisDescuentos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misDescuentos = response.data;
    debugger;
   this.result = this.misDescuentos;
    console.log("mis productos", this.vectorDescuentos);
    }catch (e) {

    }
  }

  public async filtrar() {
    this.result = await this.search(this.busqueda);
  }

  public search(text: string): any[] {
    return this.misDescuentos.filter(descuento => {
      const term = text.toLowerCase();
      debugger
      return descuento.MOTIVO_DESCUENTO.toLowerCase().includes(term) || descuento.TIPO_DESCUENTO.toLowerCase().includes(term)  // || siguiente
    });
  }

}
