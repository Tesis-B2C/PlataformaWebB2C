import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AgenteServicio} from "../../servicios/agente.servicio";
import Swal from "sweetalert2";
@Component({
  selector: 'app-olvido-contrasenia-paso2',
  templateUrl: './olvido-contrasenia-paso2.component.html',
  styleUrls: ['./olvido-contrasenia-paso2.component.css']
})
export class OlvidoContraseniaPaso2Component implements OnInit {

  public obj={Contrasenia:null,Contrasenia2:null}
  public tokenTemporal;
  public loading=false;
  constructor(private route: ActivatedRoute,private _agenteServicio: AgenteServicio) { }


  ngOnInit() {
  }

   async resetearContraseniaPaso2(){
    this.loading=true;
    try {
    this.route.paramMap.subscribe(params => {
        this.tokenTemporal=params['params'].token;
        console.log("this.token",this.tokenTemporal);
      });

      let response = await this._agenteServicio.resetearContrasenia2(this.tokenTemporal, this.obj).toPromise();
       this.mensageCorrecto(response.message);
       this.loading=false;

    }catch (e) {

    }

  }
  mensageError(mensaje)
  {
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

  mensageCorrecto(mensaje)
  {
    Swal.fire({
      icon: 'success',
      title: '<header class="login100-form-title-registro"><h5 class="card-title">!Correcto..</h5></header>',
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

