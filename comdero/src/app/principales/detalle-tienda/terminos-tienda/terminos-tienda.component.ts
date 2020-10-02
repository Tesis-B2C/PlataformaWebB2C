import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-terminos-tienda',
  templateUrl: './terminos-tienda.component.html',
  styleUrls: ['./terminos-tienda.component.css']
})
export class TerminosTiendaComponent implements OnInit {
  public Tienda;
  public idTienda;

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
      console.log("tienda buscada INFORMACION ", this.Tienda);


    } catch (e) {



      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));
      // antiguo 
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else{
        this.mensageError("Error de conexión intentelo mas tarde");
        debugger;
        this.router.navigate(['/principales/menu/principal'])
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
