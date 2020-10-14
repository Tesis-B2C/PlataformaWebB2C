import {Component, OnInit} from '@angular/core';
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-encuentranos-tienda',
  templateUrl: './encuentranos-tienda.component.html',
  styleUrls: ['./encuentranos-tienda.component.css']
})
export class EncuentranosTiendaComponent implements OnInit {
  public Tienda;
  public idTienda;
  public Sucursales = [];

  constructor(public toastr: ToastrService, public _tiendaServicio: TiendaServicio, public route: ActivatedRoute, public router: Router) {
  }

  async ngOnInit() {
    await this.getDetalleTiendaProducto();


  }



  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.parent.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      // console.log("tienda buscada encuentranos ", this.Tienda.SUCURSALs);


    } catch (e) {

      if (!(e instanceof HttpErrorResponse)){
        console.log("error Parseado:" +typeof(e)+ JSON.stringify(e));
        console.log("error como objeto:"+ e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }


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


