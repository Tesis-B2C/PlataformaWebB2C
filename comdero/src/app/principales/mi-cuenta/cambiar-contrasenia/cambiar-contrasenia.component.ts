import {Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {HttpErrorResponse} from "@angular/common/http";

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

  public loading: boolean = false;

  constructor(public _agenteServicio: AgenteServicio) {
  }

  ngOnInit() {
  }

  public async actualizarContrasenia() {
    try {
      this.loading = true;
      if (this.objCambiarContrasenia.contraseniaActual == this.objCambiarContrasenia.contraseniaNueva) {
        this.mensageError("La contraseña debe ser diferente a la actual");
        this.loading=false;
        document.forms["formCambiarContrasenia"].reset();

      } else {
        let identidad = this._agenteServicio.getIdentity();
        let response = await this._agenteServicio.actualizarContrasenia(identidad.CORREO, this.objCambiarContrasenia).toPromise();
        this.mensageCorrecto(response['message']);
        this.loading = false;
        document.forms["formCambiarContrasenia"].reset();
      }



    } catch
      (e) {
      this.loading=false;
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
     
      customClass: {
        confirmButton: 'btn btn-primary px-5'
        //icon:'sm'
      }


    });
  }
}
