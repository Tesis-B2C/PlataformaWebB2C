import {AfterContentInit, Component, OnInit} from '@angular/core';
import {AgenteServicio} from "../../servicios/agente.servicio";
import {TiendaServicio} from "../../servicios/tienda.servicio";
import {GLOBAL} from "../../servicios/global";
import {Router} from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
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

  constructor(private spinner: NgxSpinnerService,private _agenteServicio: AgenteServicio, private _tiendaServicio: TiendaServicio, public router: Router) {

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
// this.spinner.show();
    try {
      debugger;
      let identidad = this._agenteServicio.getIdentity();
      let response = await this._tiendaServicio.getMisTiendas(identidad.COD_AGENTE).toPromise();
      this.misTiendas = response.data;
      console.log("tiendas", this.misTiendas, "url", this.url);

    } catch (e) {

      this.router.navigate(['/registro-tienda']);
      console.log("error:" + JSON.stringify((e).error.message));
    }


  }

  ngAfterContentInit(): void {
    this.banderMensaje = true;
  }

  public async irAdministracionTienda(Id_Tienda) {
    this.spinner.show();
    try{
    let identidadTienda = await this._tiendaServicio.getDatosTienda(Id_Tienda).toPromise();
    localStorage.setItem("identityTienda", JSON.stringify(identidadTienda.data));
    this.router.navigate(['/administrador/administrador-tienda/gestion-tienda/menu-gestion-tienda/inicio-administracion']);
      this.spinner.hide();
    }catch (e) {
      console.log("error:" + JSON.stringify((e).error.message));
    }
  }

}
