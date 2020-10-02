import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {GLOBAL} from "../../servicios/global";
import {Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2"
import {HttpErrorResponse} from "@angular/common/http";
@Component({
  selector: 'app-tiendas',
  templateUrl: './tiendas.component.html',
  styleUrls: ['./tiendas.component.css']
})
export class TiendasComponent implements OnInit, AfterContentInit {
  public banderMensaje: boolean = false;
  public misTiendas: any;
  public url = GLOBAL.url;

  public noExite = 'assets/images/no-imagen1.png';
  constructor(public spinner: NgxSpinnerService,public _agenteServicio: AgenteServicio, public _tiendaServicio: TiendaServicio, public router: Router) {

  }
  getImagen(pathImagen){
    this.noExite = 'assets/images/no-imagen1.png';
    if(pathImagen){
    this.noExite= GLOBAL.urlImagen+pathImagen;
    console.log("direccion", this.noExite)
    }
    return this.noExite;
  }


  async ngOnInit() {
 //this.spinner.show();
    try {
      debugger;
      let identidad = this._agenteServicio.getIdentity();
      let response = await this._tiendaServicio.getMisTiendas(identidad.COD_AGENTE).toPromise();
      this.misTiendas = response.data;
      if(this.misTiendas.length==0){
        this.router.navigate(['/registro-tienda']);
      }
      console.log("tiendas", this.misTiendas, "url", this.url);

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

  ngAfterContentInit(): void {
    this.banderMensaje = true;
  }

  public async irAdministracionTienda(Id_Tienda) {
  // this.spinner.show();

    try{

    let identidadTienda = await this._tiendaServicio.getDatosTienda(Id_Tienda).toPromise();
    localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
    this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/inicio-administracion']);
    }catch (e) {
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
}
