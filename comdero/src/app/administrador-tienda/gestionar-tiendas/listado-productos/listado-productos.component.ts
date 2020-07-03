import {Component, OnDestroy, OnInit} from '@angular/core';

import {ProductoServicio} from "../../../servicios/producto.servicio";


@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],

})
export class ListadoProductosComponent implements OnInit {



  public busqueda

  page = 1;
  pageSize = 4;


  constructor(private _productoServicio: ProductoServicio) {

  }

  search(text: string): any[] {
    return this.misProductos.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente
    });
  }

  public identidadTienda;
  public misProductos;
  public result=[];
  async ngOnInit() {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misProductos = response.data;
    debugger;
    this.result = this.misProductos;
    console.log("mis productos", this.misProductos);
  }



  async busquedasasd() {
    this.result = await this.search(this.busqueda);
  }

}
