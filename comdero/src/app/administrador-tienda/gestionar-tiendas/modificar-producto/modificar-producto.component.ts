import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductoServicio} from "../../../servicios/producto.servicio";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modificar-producto',
  templateUrl: './modificar-producto.component.html',
  styleUrls: ['./modificar-producto.component.css']
})
export class ModificarProductoComponent implements OnInit {

  public idProducto;
  public identidadProducto;

  constructor(private route: ActivatedRoute, private _productoServicio: ProductoServicio) {

  }

   async ngOnInit() {

    await this.getProductos();


  }

  public async getProductos() {
    try {
      this.idProducto = this.route.snapshot.params.id;
       let response = await this._productoServicio.getProducto(this.idProducto).toPromise();
      this.identidadProducto=response.data
      console.log("producto", this.identidadProducto);
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
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
}
