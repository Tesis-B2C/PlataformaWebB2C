import {Component, OnInit} from '@angular/core';
import {Tienda} from "../../../modelos/tienda";
import {TiendaServicio} from "../../../servicios/tienda.servicio";
import Swal from "sweetalert2";

@Component({
  selector: 'app-personalizacion-tienda',
  templateUrl: './personalizacion-tienda.component.html',
  styleUrls: ['./personalizacion-tienda.component.css']
})
export class PersonalizacionTiendaComponent implements OnInit {
  public Tienda;
  public identidadTienda;
  public loading: boolean = false;

  constructor(private _tiendaServicio: TiendaServicio) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }

  ngOnInit() {
    this.Tienda = new Tienda(null, null, null, null, null,
      null, null, null, null, 1, null, 'No disponible',null);

    if (this.identidadTienda.LOGO) {
      this.urlLogo = 'http://localhost:3977/' + this.identidadTienda.LOGO;
    }
    if (this.identidadTienda.BANNER) {
      this.urlBanner = 'http://localhost:3977/' + this.identidadTienda.BANNER;
    }
  }

  //Logo
  public filesToUpload: File;
  public urlLogo;

  public async subirLogo(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.filesToUpload = <File>event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlLogo = event.target.result;
      }
      reader.readAsDataURL(this.filesToUpload);
    }
  }

  public quitarLogo() {
    this.urlLogo = "";
    this.Tienda.Logo = "";

  }


  //Banner
  public filesToUpload2: File;
  public urlBanner;

  public async subirBanner(event: any) {

    if (event.target.files && event.target.files[0]) {
      this.filesToUpload2 = <File>event.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlBanner = event.target.result;
      }
      reader.readAsDataURL(this.filesToUpload2);
    }
  }


  public quitarBanner() {
    this.urlBanner = "";
    this.Tienda.Banner = "";
  }


  public cancelar() {
    this.urlBanner = "";
    this.urlLogo = "";
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
    if (this.identidadTienda.LOGO) {
      this.urlLogo = 'http://localhost:3977/' + this.identidadTienda.LOGO;
    }
    if (this.identidadTienda.BANNER) {
      this.urlBanner = 'http://localhost:3977/' + this.identidadTienda.BANNER;
    }
  }

  public async updatePersonalizacionTienda() {
    try {
      this.loading = true;
      debugger;
      let response = await this._tiendaServicio.updatePersonalizacionTienda(this.identidadTienda.NUM_TIENDA, this.filesToUpload, this.filesToUpload2).toPromise();
      this.mensageCorrecto(response['message']);
      let identidadTienda = await this._tiendaServicio.getDatosTienda(this.identidadTienda.NUM_TIENDA).toPromise();
      localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
    } catch (e) {
      this.loading = false;
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
