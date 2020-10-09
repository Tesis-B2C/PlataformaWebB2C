import {Component, HostListener} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Toast, ToastrService} from "ngx-toastr";
import {TiendaServicio} from "../../servicios/tienda.servicio";

@Component({
  selector: 'app-loguin',
  templateUrl: './loguin.component.html',
  styleUrls: ['./loguin.component.css']
})
export class LoguinComponent {
  public obj = {
    Correo: null,
    Contrasenia: null
  };
  public identity;
  public token;
  public loading: boolean = false;
  public tokenTemporal;
  public response;


  @HostListener('window:click', ['$event']) onClick(event) {
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      this.toastr.warning("Mayúsculas activas");
    } else {
      this.toastr.clear();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event) {
    if (event.getModifierState && event.getModifierState('CapsLock')) {
      this.toastr.warning("Mayúsculas activas");
    } else {
      this.toastr.clear();
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event) {
    if (event.getModifierState && event.getModifierState('CapsLock')) {

      this.toastr.warning("Mayúsculas activas");
    } else {
      this.toastr.clear();
    }
  }

  constructor(public _tiendaServicio: TiendaServicio, public toastr: ToastrService, public route: ActivatedRoute, public _agenteServicio: AgenteServicio, public router: Router) {

  }


  public async loguin() {
    try {
      this.loading = true;
      this.tokenTemporal = this.route.snapshot.params.token;
      console.log("this.token", this.tokenTemporal);
      if (!this.tokenTemporal) {
        this.response = await this._agenteServicio.autenticarAgente(this.obj, "").toPromise();
      } else {
        this.response = await this._agenteServicio.autenticarActivarAgente(this.obj, "", this.tokenTemporal).toPromise();
      }
      this.identity = this.response.data;

      if (!this.identity.CORREO) {
        this.mensageError("el usuario no se ha logueado correctamente");
      } else {


        localStorage.setItem("identity", JSON.stringify(this.identity));
        let reponse2 = await this._agenteServicio.autenticarAgente(this.obj, "true").toPromise();
        this.loading = false;
        this.token = reponse2.token;
        if (this.token.length <= 0) {
          this.mensageError("el token nose ha generado");
        } else {
          localStorage.setItem("Token", this.token);
          this.router.navigate(['principales/menu/principal']);
        }
      }
    } catch (e) {
      this.loading = false;
      if (!(e instanceof HttpErrorResponse)) {
        console.log("error Parseado:" + typeof (e) + JSON.stringify(e));
        console.log("error como objeto:" + e);
        if (JSON.stringify(e) === '{}')
          this.mensageError(e);
        else this.mensageError(JSON.stringify(e));
      }
    }
    this.loading = false;
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


}
