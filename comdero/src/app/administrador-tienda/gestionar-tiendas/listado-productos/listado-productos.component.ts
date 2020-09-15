import {Component, DoCheck, OnChanges, OnDestroy, OnInit} from '@angular/core';

import {ProductoServicio} from "../../../servicios/producto.servicio";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";


@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],

})
export class ListadoProductosComponent implements OnInit {


  public busqueda;

  public page = 1;
  public pageSize = 10;
  public vectorProductos = new Set();
  public identidadTienda;
  public misProductos: any = [];
  public result = [];
  public loading: boolean = false;
  public ofertasPorBorrar = [];


  constructor(public modalService: NgbModal, public _productoServicio: ProductoServicio) {

  }


  async ngOnInit() {
    this.loading=true;
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
    this.misProductos = response.data;
    debugger;
    this.result = this.misProductos;
    console.log("mis productos", this.misProductos);
    this.loading=false;
  }


  public async filtrar() {
    this.loading=true;
    this.result = await this.search(this.busqueda);
    this.loading=false;
  }

  public search(text: string): any[] {
    return this.misProductos.filter(producto => {
      const term = text.toLowerCase();
      debugger
      return producto.PRODUCTO.NOMBRE_PRODUCTO.toLowerCase().includes(term)  // || siguiente
    });
  }

  public async cambiarEstadoProducto(Id_Oferta, estado) {

    try {

      let responseUpdate = await this._productoServicio.updateEstadoProducto(Id_Oferta, estado).toPromise();
      this.mensageCorrecto(responseUpdate.message);
      let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
      this.misProductos = null;
      this.misProductos = response.data;
      this.result = this.misProductos;
      console.log("mis productos 2", this.misProductos);

    } catch (e) {

      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }

  }


  public async cambiarEstadoProductos(estado) {
    try {
      this.ofertasPorBorrar = [];
      for (let producto of this.vectorProductos) {
        this.ofertasPorBorrar.push(producto);
      }
      let responseUpdate = await this._productoServicio.updateEstadoProductos(this.ofertasPorBorrar, estado).toPromise();
      this.mensageCorrecto(responseUpdate.message);
      this.vectorProductos = new Set();
      let response = await this._productoServicio.getMisProductos(this.identidadTienda.NUM_TIENDA).toPromise();
      this.misProductos = null;
      this.misProductos = response.data;
      this.result = this.misProductos;
      console.log("mis productos 2", this.misProductos);

    } catch (e) {

      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }

  }


  public agregarTodosProductos(event) {
    if (event.target.checked) {
      debugger
      for (let i in this.result) {
        this.vectorProductos.add(this.result[i].ID_OFERTA);
      }
      console.log("vector productos", this.vectorProductos)


    } else {
      this.vectorProductos = new Set();
    }

  }


  public agregarProducto(event, cod) {
    if (event.target.checked) {
      debugger
      this.vectorProductos.add(cod);
      console.log("vector productos", this.vectorProductos)
    } else {
      //this.vectorProductos = new Set();
      this.vectorProductos.delete(cod);
    }

  }

  mensageError(mensaje) {
    Swal.fire({
      icon: 'error',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Error..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal'
        //icon:'sm'
      }
    });
  }


  mensageCorrecto(mensaje) {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
      text: mensaje,
      position: 'center',
      width: 600,
      buttonsStyling: false,
      //footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }

}
