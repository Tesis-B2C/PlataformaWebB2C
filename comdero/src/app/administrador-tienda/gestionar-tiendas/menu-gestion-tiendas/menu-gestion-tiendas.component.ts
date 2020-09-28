import {Component} from '@angular/core';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {TiendaServicio} from "../../../servicios/tienda.servicio";

@Component({
  selector: 'app-menu-gestion-tiendas',
  templateUrl: './menu-gestion-tiendas.component.html',
  styleUrls: ['./menu-gestion-tiendas.component.css']
})
export class MenuGestionTiendasComponent {
  public banderaSideBar: boolean = false;
  public identidadTienda;

  constructor(public _tiendaServicio: TiendaServicio, public router: Router) {
    this.identidadTienda = JSON.parse(localStorage.getItem("identityTienda"));
  }

  abrirSideBar() {
    this.banderaSideBar = !this.banderaSideBar;
  }

  cerrarSideBar(){
    let body=document.getElementById('body') as HTMLElement;
    console.log("tamanio",body.offsetWidth);
    if(body.offsetWidth<720){
      this.banderaSideBar = !this.banderaSideBar;
    }
  }
  public async updateEstadoTienda(estado) {
    Swal.fire({
      title: '<header class="login100-form-title-registro mb-o"><h5 class="card-title"><strong>!Estas seguro</strong></h5></header>',
      text: "Al ocultar la tienda, esta no será visible para los usuarios de la plataforma al igual que los productos que contenga, por otro lado la tienda podra ser recuperada en cualquier momento incluyendo sus productos",
      icon: 'warning',
      position: 'center',
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        container: 'my-swal',
        cancelButton: 'btn btn-secondary px-5 ml-5',
      }
    }).then(async (result) => {
      if (result.value) {
        try {
          let responseUpdate = await this._tiendaServicio.updateEstadoTienda(this.identidadTienda.NUM_TIENDA, estado).toPromise();
          this.mensageCorrecto(responseUpdate['menssage']);
          localStorage.removeItem("identityTienda");
          this.router.navigate(['/administrador/administrador-tienda/mis-tiendas'])
        } catch (e) {
          console.log("error:" + e);
          if (JSON.stringify((e).error.message))
            this.mensageError(JSON.stringify((e).error.message));
          else this.mensageError("Error de conexión intentelo mas tarde");
        }
      }
    })


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
