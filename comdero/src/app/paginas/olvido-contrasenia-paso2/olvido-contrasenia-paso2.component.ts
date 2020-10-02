import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
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
  constructor(public route: ActivatedRoute,public _agenteServicio: AgenteServicio,public router: Router) { }


  ngOnInit() {
  }

   async resetearContraseniaPaso2(){
    this.loading=true;
    try {
   /* this.route.paramMap.subscribe(params => {
        this.tokenTemporal=params['params'].token;
        console.log("this.token",this.tokenTemporal);
      });*/
    this.tokenTemporal=this.route.snapshot.params.token;
      console.log("this.token",this.tokenTemporal);
      let response = await this._agenteServicio.resetearContrasenia2(this.tokenTemporal, this.obj).toPromise();
       this.mensageCorrecto(response.message);
      this.router.navigate(['loguin']);
       this.loading=false;

    }catch (e) {
      this.loading = false;
      console.log("error Parseado:" + JSON.stringify(e));
      console.log("error como objeto:"+ e);
      if (JSON.stringify(e) === '{}')
        this.mensageError(e);
      else this.mensageError(JSON.stringify(e));
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
      footer: '<a href="http://localhost:4200/loguin"><b><u>Autentificate Ahora</u></b></a>',
      customClass: {
        confirmButton: 'btn btn-primary px-5',
        //icon:'sm'
      }
    });
  }
}

