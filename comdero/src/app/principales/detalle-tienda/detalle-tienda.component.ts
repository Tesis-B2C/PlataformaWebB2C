import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import Swal from "sweetalert2";

@Component({
  selector: 'app-detalle-tienda',
  templateUrl: './detalle-tienda.component.html',
  styleUrls: ['./detalle-tienda.component.css']
})
export class DetalleTiendaComponent implements OnInit {

  public idTienda;
  public Tienda;

  constructor(private _tiendaServicio: TiendaServicio, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.getDetalleTiendaProducto();
  }

  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.snapshot.params.id;
      this.Tienda = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
       console.log("tienda buscada", this.Tienda)

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
