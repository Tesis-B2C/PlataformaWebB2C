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
  public Tienda: any;
  public Logo = "";
  public Banner = "";

  constructor(private _tiendaServicio: TiendaServicio, private route: ActivatedRoute) {

  }

  async ngOnInit() {
    await this.getDetalleTiendaProducto();
    await this.getLogo();
    await this.getBanner();

  }

  async getDetalleTiendaProducto() {
    try {
      this.idTienda = this.route.snapshot.params.id;
      let response = await this._tiendaServicio.getDetalleTiendaProducto(this.idTienda).toPromise();
      this.Tienda = response.data;
      console.log("tienda buscada", this.Tienda);
    } catch (e) {
      console.log("error:" + e);
      if (JSON.stringify((e).error.message))
        this.mensageError(JSON.stringify((e).error.message));
      else this.mensageError("Error de conexión intentelo mas tarde");
    }


  }

  getLogo() {
    this.Logo = 'assets/images/no-image.png';
    let pathImagen = this.Tienda.LOGO;

    if (pathImagen) {
      this.Logo = 'http://localhost:3977/' + pathImagen;
      console.log("direccion", this.Logo)
    }
    return this.Logo;
  }

  getBanner() {
    this.Banner='assets/images/no-image.png';
    let pathImagen = this.Tienda.BANNER;
    if (pathImagen) {
      this.Banner = 'http://localhost:3977/' + pathImagen;
      console.log("direccion", this.Banner)
    }
    return this.Banner;
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
