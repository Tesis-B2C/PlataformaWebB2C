import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../../servicios/agente.servicio";
import Swal from "sweetalert2";


@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {
  public compararContrasenia;
  public objCambiarContrasenia = {
    contraseniaActual: null,
    contraseniaNueva: null
  }

  constructor(private _agenteServicio: AgenteServicio) {
  }

  ngOnInit() {
  }

  public async actualizarContrasenia() {
    try {
      if (this.objCambiarContrasenia.contraseniaActual == this.objCambiarContrasenia.contraseniaNueva) {
        this.mensageError("La contraseña debe ser diferente a la actual");

      } else {
        let identidad = this._agenteServicio.getIdentity();
        let response = await this._agenteServicio.actualizarContrasenia(identidad.CORREO, this.objCambiarContrasenia).toPromise();
        this.mensageCorrecto(response['message']);
      }
    } catch
      (e) {
      console.log("error:" + JSON.stringify((e).error.message));
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
        confirmButton: 'btn btn-primary px-5'
        //icon:'sm'
      }


    });
  }
}
