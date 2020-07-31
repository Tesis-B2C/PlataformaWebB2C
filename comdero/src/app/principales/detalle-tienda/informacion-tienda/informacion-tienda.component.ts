import {Component, OnInit} from '@angular/core';
import Swal from "sweetalert2";
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-informacion-tienda',
  templateUrl: './informacion-tienda.component.html',
  styleUrls: ['./informacion-tienda.component.css']
})
export class InformacionTiendaComponent implements OnInit {
  public Tienda;
  public idTienda;

  constructor(public toastr: ToastrService, private _tiendaServicio: TiendaServicio, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.getDetalleTiendaProducto();
  }


  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      console.log("tienda buscada encuentranos ", this.Tienda.SUCURSALs);


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
